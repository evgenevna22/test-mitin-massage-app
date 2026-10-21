<template>
  <header>
    <p>welcome to the mitin massage, mitya</p>
    <RoleSwitcher view-as="client" />
  </header>

  <div class="main">
    <div class="card">
      <Tabs value="0">
        <TabList>
          <Tab value="0">Month</Tab>
          <Tab value="1">List</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="0">
            <div class="month-view">
              <SkeletonProgress height="242px" v-if="isMonthDatesLoading" />
              <template v-else>
                <Calendar
                  :mode="calendarMode"
                  :disabled-Dates="disabledDates"
                  :working-dates="workingDates"
                  :booked-dates="bookedDates"
                  @date-select="handleDateSelect"
                  @month-change="handleMonthChange"
                />

                <MasterSchedule
                  v-if="!isCreatingMode && slotsByMonth"
                  :selected-dates="selectedDates"
                  :slots-by-month="slotsByMonth"
                  :is-editing-mode="isEditingMode"
                  @create-slot="handleCreateSlot"
                  @edit-slot="handleEditSlot"
                  @delete-slot="handleDeleteSlot"
                  @select-target="handleTargetSelect"
                />

                <MasterSlotBuilder
                  v-else
                  :selected-dates="selectedDates"
                  :loading-status="loadingStatus"
                  :server-error="slotCreationError"
                  @return="handleClickReturn"
                  @create="handleClickCreate"
                />
              </template>
            </div>
          </TabPanel>
          <TabPanel value="1">
            <MasterUpcomingSlots />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>

    <SlotForm
      v-if="sourceSlot && targetSlot"
      :current-slot="sourceSlot"
      :target-slot="targetSlot"
      :saving="loadingStatus.reschedulingSlot"
      @back="closeRescheduleDialog"
      @save="handleReschedule"
    />

    <div class="action-buttons">
      <Button
        v-if="calendarView === 'default'"
        class="action-button"
        icon="pi pi-plus"
        label="Add work slots"
        size="large"
        @click="handleClickAddSlots"
      />
      <Button
        v-else-if="isEditingMode"
        class="action-button"
        icon="pi pi-times"
        label="Cancel"
        severity="danger"
        size="large"
        @click="handleClickReturn"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RoleSwitcher, SkeletonProgress } from '@components';
import MasterUpcomingSlots from './upcoming-slots/MasterUpcomingSlots.vue';
import Calendar from '@components/calendar/Calendar.vue';
import { useMasterMonthDates } from '@/shared/composables/use-master-month-dates';
import MasterSchedule from './schedule/MasterSchedule.vue';
import { useSlots } from './use-slots.ts';
import MasterSlotBuilder from './slot-builder/MasterSlotBuilder.vue';
import type { TimeSlot } from '@/types/slot.ts';
import type { SlotDTO } from '@/types/slot.ts';
import { SlotForm } from '@components';

type CalendarView = 'creating' | 'editing' | 'default';

const {
  getSlotsByMonth,
  slotsByMonth,
  createSlots,
  loadingStatus,
  rescheduleSlot,
} = useSlots();

const {
  workingDates,
  bookedDates,
  freeWorkingDates,
  loadMonthDates,
  isMonthDatesLoading,
} = useMasterMonthDates();

const today = new Date();

const selectedDates = ref<Date[]>([]);

const slotCreationError = ref('');

const calendarView = ref<CalendarView>('default');
const sourceSlot = ref<SlotDTO>();
const targetSlot = ref<SlotDTO>();

const visibleYear = ref(today.getFullYear());
const visibleMonth = ref(today.getMonth() + 1);

const isCreatingMode = computed(() => calendarView.value === 'creating');
const isEditingMode = computed(() => calendarView.value === 'editing');

const calendarMode = computed(() =>
  isCreatingMode.value ? 'multiple' : 'single'
);

// rename
const workingDatesFormatted = computed(() =>
  workingDates.value.map((day) => new Date(day))
);

const disabledDates = computed<Date[]>(() => {
  if (isCreatingMode.value) {
    return workingDatesFormatted.value;
  }

  if (isEditingMode.value) {
    const availableDays = new Set(freeWorkingDates.value);
    const lastDay = new Date(
      visibleYear.value,
      visibleMonth.value,
      0
    ).getDate();

    return Array.from({ length: lastDay }, (_, index) => index + 1)
      .filter(
        (day) =>
          !availableDays.has(
            `${visibleYear.value}-${String(visibleMonth.value).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          )
      )
      .map((day) => new Date(visibleYear.value, visibleMonth.value - 1, day));
  }

  return [];
});

const handleDateSelect = (value: Date | Date[]) => {
  selectedDates.value = Array.isArray(value) ? value : [value];
};

const handleClickAddSlots = () => {
  selectedDates.value = [];
  calendarView.value = 'creating';
};

const handleClickReturn = () => {
  sourceSlot.value = undefined;
  targetSlot.value = undefined;
  calendarView.value = 'default';
};

const handleClickCreate = async (timeSlots: TimeSlot) => {
  slotCreationError.value = '';
  try {
    await createSlots(selectedDates.value, timeSlots);
    calendarView.value = 'default';
  } catch (error) {
    const responseError = error as {
      response?: { data?: { error?: string } };
    };
    slotCreationError.value =
      responseError.response?.data?.error || 'Failed to save slots';
  }
};

const handleCreateSlot = () => {};

const handleEditSlot = (slot: SlotDTO) => {
  sourceSlot.value = slot;
  targetSlot.value = undefined;
  calendarView.value = 'editing';
};
const handleDeleteSlot = () => {};

const handleTargetSelect = (slot: SlotDTO) => {
  if (slot.status !== 'free' || !sourceSlot.value) return;
  targetSlot.value = slot;
};

const closeRescheduleDialog = () => {
  targetSlot.value = undefined;
};

const handleReschedule = async (comment: string) => {
  if (!sourceSlot.value || !targetSlot.value) {
    return;
  }

  try {
    await rescheduleSlot({
      sourceSlotId: sourceSlot.value.id,
      targetSlotId: targetSlot.value.id,
      comment,
    });
    const newDate = new Date(`${targetSlot.value.date}T00:00:00`);

    await Promise.all([
      getSlotsByMonth(visibleYear.value, String(visibleMonth.value)),
      loadMonthDates(visibleYear.value, String(visibleMonth.value)),
    ]);

    selectedDates.value = [newDate];
    targetSlot.value = undefined;
    sourceSlot.value = undefined;

    calendarView.value = 'default';
  } catch (error) {
    console.error(error);
  }
};

const handleMonthChange = ({
  month,
  year,
}: {
  month: number;
  year: number;
}) => {
  visibleYear.value = year;
  visibleMonth.value = month + 1;
  loadMonthDates(year, String(month + 1));
  getSlotsByMonth(year, String(month + 1));
};

onMounted(() => {
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString();

  loadMonthDates(year, month);
  getSlotsByMonth(year, month);
});
</script>

<style lang="scss" scoped>
.main {
  max-width: 500px;
  width: 100%;
  margin: 16px auto;
}

.month-view {
  position: relative;
  display: flex;
  flex-direction: column;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--gap-2x);
  width: 100%;
  padding: var(--gap-3x);
}

.action-button {
  width: 100%;
}
</style>
