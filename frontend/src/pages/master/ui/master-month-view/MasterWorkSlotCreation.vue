<template>
  <div class="month-view">
    <SkeletonProgress v-if="isMonthSlotsLoading" height="242px" />
    <MasterCalendar
      v-show="!isMonthSlotsLoading"
      mode="multiple"
      :month-occupancy="monthOccupancy"
      :visible-month="visibleMonth"
      :min-date="minDate"
      @date-select="selectDates"
      @month-change="handleMonthChange"
    />

    <MasterSlotBuilder
      v-show="!isMonthSlotsLoading"
      :selected-dates="selectedDates"
      @return="$emit('cancel')"
      @created="$emit('completed')"
    />
  </div>
</template>

<script setup lang="ts">
import { SkeletonProgress } from '@/shared/ui';
import MasterCalendar from './master-calendar/MasterCalendar.vue';
import MasterSlotBuilder from './master-slot-builder/MasterSlotBuilder.vue';
import { useMasterMonthData } from '@/pages/master/api/use-master-month-data';
import { useMonthNavigation } from './model/use-master-month-navigation';

defineEmits<{
  cancel: [];
  completed: [];
}>();

const minDate = new Date();

const {
  monthOccupancy,
  isMonthDataLoading: isMonthSlotsLoading,
  loadMonthData,
} = useMasterMonthData();

const { selectedDates, visibleMonth, selectDates, handleMonthChange } =
  useMonthNavigation(loadMonthData);

</script>

<style lang="scss" scoped>
.month-view {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--gap-2x);
}
</style>
