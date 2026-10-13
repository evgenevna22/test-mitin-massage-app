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
            <DatePicker v-model="selectedDate" inline />

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
import { computed, reactive, ref } from 'vue';
import type { TimeSlot } from '@/types';
import { transformDate } from '@utils';
import { useRouter } from 'vue-router';
import { useSlots } from './use-slots';
import AdminUpcomingSlots from './upcoming-slots/AdminUpcomingSlots.vue';

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

const today = new Date();

const step = ref(Step.First);

const selectedDate = ref<Date>(today);
const dates = ref<Date[]>([]);

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

const isBackButtonVisible = computed(() => step.value === Step.Second);

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

const handleClickBackButton = () => {
  step.value = Step.First;
};

const resetTimeSlots = () => {
  Object.assign(timeSlot, getInitialTimeSlotState());
};

const resetDates = () => {
  dates.value = [];
};
</script>

<style lang="scss" scoped>
.month-view {
  display: flex;
  flex-direction: column;
}

.upcoming-slots {
  width: max-content;
}
</style>
