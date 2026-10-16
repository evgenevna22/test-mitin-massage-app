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
                  :pre-selected-date="selectedDate"
                  :disabled-Dates="disabledDates"
                  :working-dates="workingDates"
                  :booked-dates="bookedDates"
                  @date-select="handleDateSelect"
                />

                <AdminSchedule
                  v-if="slotsByMonth"
                  :selected-date="selectedDate"
                  :slots-by-month="slotsByMonth"
                />
              </template>
            </div>
          </TabPanel>
          <TabPanel value="1">
            <AdminUpcomingSlots class="upcoming-slots" />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
    <!-- <div class="card">
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
  </div> -->
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RoleSwitcher, SkeletonProgress } from '@components';
import AdminUpcomingSlots from './upcoming-slots/AdminUpcomingSlots.vue';
import Calendar from '@components/calendar/Calendar.vue';
import { useMasterMonthDates } from '@/shared/composables/use-master-month-dates';
import AdminSchedule from './schedule/AdminSchedule.vue';
import { useSlots } from './use-slots';

const { getSlotsByMonth, slotsByMonth } = useSlots();
const { workingDates, bookedDates, loadMonthDates, isMonthDatesLoading } =
  useMasterMonthDates();

const today = new Date();

const selectedDate = ref<Date>(today);

const disabledDates = computed(() => []);
const year = computed(() => selectedDate.value.getFullYear());
const month = computed(() => (selectedDate.value.getMonth() + 1).toString());

const handleDateSelect = (date: Date) => {
  selectedDate.value = date;
};

onMounted(() => {
  loadMonthDates(year.value, month.value);
  getSlotsByMonth(year.value, month.value);
});
</script>

<style lang="scss">
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
</style>
