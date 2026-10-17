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
                />

                <MasterSchedule
                  v-if="!isCreatingMode && slotsByMonth"
                  :selected-dates="selectedDates"
                  :slots-by-month="slotsByMonth"
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
            <MasterUpcomingSlots class="upcoming-slots" />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>

    <div class="action-buttons">
      <Button
        v-if="!isCreatingMode"
        class="action-button"
        icon="pi pi-plus"
        label="Add work slots"
        size="large"
        @click="handleClickAddSlots"
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

type CalendarView = 'creating' | 'editing' | 'default';

const { getSlotsByMonth, slotsByMonth, createSlots, loadingStatus } =
  useSlots();
const { workingDates, bookedDates, loadMonthDates, isMonthDatesLoading } =
  useMasterMonthDates();

const today = new Date();

const selectedDates = ref<Date[]>([]);
const slotCreationError = ref('');
const calendarView = ref<CalendarView>('default');

const isCreatingMode = computed(() => calendarView.value === 'creating');

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

  if (calendarView.value === 'editing') {
    // return workingDates.value.map((day) => new Date(day));
    return []; // понять, нужна ли еще одна ручка с бэка
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

.upcoming-slots {
  width: max-content;
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
