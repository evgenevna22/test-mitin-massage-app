<template>
  <div class="card">
    <Tabs value="0">
      <TabList>
        <Tab value="0">Month</Tab>
        <Tab value="1">List</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <div class="month-view">
            <Calendar
              :pre-selected-date="selectedDate"
              :disabled-Dates="disabledDates"
              :working-dates="workingDates"
              :booked-dates="bookedDates"
              @date-select="handleDateSelect"
            />

            <AdminUpcomingSlots
              :selected-date="selectedDate"
              class="upcoming-slots"
            />
          </div>
        </TabPanel>
        <TabPanel value="1">
          <AdminUpcomingSlots class="upcoming-slots" />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>

  <h3 class="title">Select {{ stepTitle }}</h3>
  <div class="card">
    <div v-if="step === Step.Second" class="time-block">
      Dates:
      <ul>
        <li v-for="date in dates" :key="date.getTime()">
          <Badge :value="transformDate(date)" severity="secondary" />
        </li>
      </ul>
      <label>Start time</label>
      <input type="time" v-model="timeSlot.start" />

      <label>End time</label>
      <input type="time" v-model="timeSlot.end" />
    </div>

    <div class="buttons">
      <Button
        label="Изменить день"
        :loading="isLoading"
        :disabled="isSaveButtonDisabled"
        @click="handleClickButton"
      />
      <Button
        :label="saveButtonLabel"
        :loading="isLoading"
        :disabled="isSaveButtonDisabled"
        @click="handleClickButton"
      />

      <Button label="Reset" @click="handleClickResetButton" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import type { TimeSlot } from '@/types';
import { transformDate } from '@utils';
import { useRouter } from 'vue-router';
import { useSlots } from '../use-slots';
import AdminUpcomingSlots from '../upcoming-slots/AdminUpcomingSlots.vue';
import Calendar from '@components/calendar/Calendar.vue';
import { useAdminMonthDates } from '@/shared/composables/use-admin-month-dates.ts';

const Step = {
  First: 0,
  Second: 1,
};

const getInitialTimeSlotState = (): TimeSlot => ({
  start: '',
  end: '',
});

const router = useRouter();
const { createSlots, isLoading } = useSlots();
const { workingDates, bookedDates, loadMonthDates } = useAdminMonthDates();

const today = new Date();

const step = ref(Step.First);

const selectedDate = ref<Date>(today);
const dates = ref<Date[]>([]);
const disabledDates = computed(() => []);

const timeSlot = reactive(getInitialTimeSlotState());

const isTimeSlotsFilled = computed(() =>
  Object.values(timeSlot).every(Boolean)
);

const stepTitle = computed(() =>
  step.value === Step.First ? 'dates' : 'time'
);
const saveButtonLabel = computed(() =>
  step.value === Step.First ? 'Continue' : 'Save'
);

const isSaveButtonDisabled = computed(() =>
  step.value === Step.First ? !dates.value.length : !isTimeSlotsFilled.value
);

const handleClickButton = async () => {
  if (step.value === Step.First) {
    step.value = Step.Second;

    return;
  }

  if (dates.value.length && isTimeSlotsFilled.value) {
    await createSlots(dates.value, timeSlot);
    resetTimeSlots();
    resetDates();

    router.push('/');
  }
};

const handleClickResetButton = () => {
  if (step.value === Step.First) {
    resetDates();
    return;
  }
  resetTimeSlots();
};

const handleDateSelect = (date: Date) => {
  selectedDate.value = date;
};

const resetTimeSlots = () => {
  Object.assign(timeSlot, getInitialTimeSlotState());
};

const resetDates = () => {
  dates.value = [];
};

onMounted(() => {
  loadMonthDates(
    selectedDate.value.getFullYear(),
    (selectedDate.value.getMonth() + 1).toString()
  );
});
</script>

<style lang="scss" scoped>
.month-view {
  display: flex;
  flex-direction: column;
}

.upcoming-slots {
  width: max-content;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}
</style>
