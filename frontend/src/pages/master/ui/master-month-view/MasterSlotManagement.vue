<template>
  <div class="month-view">
    <SkeletonProgress v-if="isMonthDataLoading" height="350px" />
    <MasterCalendar
      v-show="!isMonthDataLoading"
      :view-mode="calendarView"
      :month-occupancy="monthOccupancy"
      :visible-month="visibleMonth"
      @date-select="selectDates"
      @month-change="handleMonthChange"
    />

    <MasterSchedule
      v-if="calendarView !== 'creating' && slotsDetailsByMonth"
      v-show="!isMonthDataLoading"
      :selected-dates="selectedDates"
      :slots-details-by-month="slotsDetailsByMonth"
      :is-editing-mode="isEditing"
      @create-slot="handleCreateSlot"
      @edit-slot="editSlot"
      @delete-slot="deleteSlot"
      @select-target="selectTarget"
    />

    <MasterSlotEditingForm
      v-if="sourceSlot && targetSlot"
      :visible="Boolean(sourceSlot && targetSlot)"
      :current-slot="sourceSlot"
      :target-slot="targetSlot"
      @back="closeRescheduleDialog"
      @saved="handleSlotSaved"
    />

    <div class="action-buttons">
      <Button
        v-if="calendarView === 'default'"
        class="action-button"
        icon="pi pi-plus"
        label="Add work slots"
        size="large"
        @click="$emit('create-work-days')"
      />
      <Button
        v-else-if="isEditing"
        class="action-button"
        icon="pi pi-times"
        label="Cancel"
        severity="danger"
        size="large"
        @click="cancelEditing"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { SkeletonProgress } from '@/shared/ui';
import MasterCalendar from './master-calendar/MasterCalendar.vue';
import MasterSchedule from './master-schedule/MasterSchedule.vue';
import MasterSlotEditingForm from './master-slot-editing-form/MasterSlotEditingForm.vue';
import { useMasterMonthData } from '@/pages/master/api/use-master-month-data';
import type { CalendarView } from './model/types';
import { useMonthNavigation } from './model/use-master-month-navigation';
import { useExistingSlotActions } from './model/use-existing-slot-actions';
import { useManualBookingCreation } from './model/use-manual-booking-creation';

defineEmits<{ 'create-work-days': [] }>();

const calendarView = ref<CalendarView>('default');

const isEditing = computed(() => calendarView.value === 'editing');

const {
  slotsDetailsByMonth,
  monthOccupancy,
  isMonthDataLoading,
  loadMonthData,
} = useMasterMonthData();

const { selectedDates, visibleMonth, selectDates, handleMonthChange } =
  useMonthNavigation(loadMonthData);

const {
  sourceSlot,
  targetSlot,
  editSlot,
  deleteSlot,
  selectTarget,
  closeRescheduleDialog,
  cancelEditing,
  handleSlotSaved,
} = useExistingSlotActions({
  calendarView,
  selectedDates,
  loadMonthData,
});

const { handleCreateSlot } = useManualBookingCreation();

onMounted(async () => {
  const today = new Date();

  await loadMonthData(
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0')
  );
});
</script>

<style lang="scss" scoped>
.month-view {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--gap-2x);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--gap-2x);
  width: 100%;
  padding: var(--gap-3x) 0;
}

.action-button {
  width: 100%;
}
</style>
