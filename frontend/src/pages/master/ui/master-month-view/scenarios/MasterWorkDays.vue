<template>
  <div class="month-view">
    <SkeletonProgress v-if="isMonthSlotsLoading" height="242px" />
    <MasterCalendar
      v-show="!isMonthSlotsLoading"
      mode="multiple"
      view-mode="creating"
      :month-occupancy="monthOccupancy"
      :visible-month="visibleMonth"
      @date-select="selectDates"
      @month-change="handleMonthChange"
    />

    <MasterSlotBuilder
      v-show="!isMonthSlotsLoading"
      :selected-dates="selectedDates"
      :loading-status="loadingStatus"
      :server-error="slotCreationError"
      @return="$emit('cancel')"
      @create="saveWorkSlots"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SkeletonProgress } from '@/shared/ui';
import MasterCalendar from '../master-calendar/MasterCalendar.vue';
import MasterSlotBuilder from '../master-slot-builder/MasterSlotBuilder.vue';
import { useMasterMonthData } from '@/pages/master/api/use-master-month-data';
import { useMasterSlotsLoader } from '../../../api/use-master-slots-loader';
import type { CalendarView } from '../model/types';
import { useMonthNavigation } from '../model/use-master-month-navigation';
import { useWorkSlotCreation } from '../model/use-work-slot-creation';

const emit = defineEmits<{
  cancel: [];
  completed: [];
}>();

const { createSlots, loadingStatus } = useMasterSlotsLoader();
const {
  monthOccupancy,
  isMonthDataLoading: isMonthSlotsLoading,
  loadMonthData,
} = useMasterMonthData();

const {
  selectedDates,
  visibleMonth,
  selectDates,
  handleMonthChange,
  reloadVisibleMonthData,
} = useMonthNavigation(loadMonthData);

const {
  error: slotCreationError,
  saveWorkSlots: saveWorkSlotsAndReturn,
} = useWorkSlotCreation({
  calendarView: ref<CalendarView>('creating'),
  selectedDates,
  createSlots,
  reloadVisibleMonthData,
});

const saveWorkSlots = async (timeSlots: Parameters<typeof saveWorkSlotsAndReturn>[0]) => {
  await saveWorkSlotsAndReturn(timeSlots);
  if (!slotCreationError.value) emit('completed');
};
</script>

<style lang="scss" scoped>
.month-view {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--gap-2x);
}
</style>
