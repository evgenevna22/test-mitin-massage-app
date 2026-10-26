<template>
  <div class="month-view">
    <SkeletonProgress v-if="isMonthDataLoading" height="350px" />
    <MasterCalendar
      v-show="!isMonthDataLoading"
      :month-occupancy="monthOccupancy"
      :visible-month="visibleMonth"
      :disabled-dated="disabledDates"
      @date-select="selectDates"
      @month-change="handleMonthChange"
    />

    <MasterSchedule
      v-if="slotsDetailsByMonth"
      v-show="!isMonthDataLoading"
      :selected-dates="selectedDates"
      :slots-details-by-month="slotsDetailsByMonth"
      :is-editing-mode="isEditing"
      @create-slot="openManualBooking"
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

    <MasterSlotDeletionDialog
      v-if="slotToDelete"
      :visible="Boolean(slotToDelete)"
      :current-slot="slotToDelete"
      @back="closeDeleteDialog"
      @slot-deleted="handleDeletedSlot"
    />

    <MasterManualBookingForm
      v-if="bookingSlot"
      :visible="Boolean(bookingSlot)"
      :booking-slot="bookingSlot"
      @close="handleBookingFormClosed"
      @saved="handleBookingFormSaved"
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
import { computed, defineAsyncComponent, onMounted, ref } from 'vue';
import { SkeletonProgress } from '@/shared/ui';
import MasterCalendar from './master-calendar/MasterCalendar.vue';
import { useMasterMonthData } from '@/pages/master/api/use-master-month-data';
import type { CalendarView } from './model/types';
import { useMonthNavigation } from './model/use-master-month-navigation';
import { useExistingSlotActions } from './model/use-existing-slot-actions';
import type { SlotDTO } from '@/pages/master/model/slot';
import { formatDate } from '@shared/lib';

defineEmits<{ 'create-work-days': [] }>();

const MasterSchedule = defineAsyncComponent(
  () => import('./master-schedule/MasterSchedule.vue')
);
const MasterSlotEditingForm = defineAsyncComponent(
  () => import('./master-slot-editing-form/MasterSlotEditingForm.vue')
);
const MasterSlotDeletionDialog = defineAsyncComponent(
  () => import('./master-slot-deletion-dialog/MasterSlotDeletionDialog.vue')
);
const MasterManualBookingForm = defineAsyncComponent(
  () => import('./MasterManualBookingForm.vue')
);

const calendarView = ref<CalendarView>('default');
const bookingSlot = ref<SlotDTO>();

const isEditing = computed(() => calendarView.value === 'editing');

const disabledDates = computed<Date[]>(() => {
  const { year, month } = visibleMonth.value;
  const datesWithFreeSlots = new Set(monthOccupancy.value.datesWithFreeSlots);
  const lastDay = new Date(year, month, 0).getDate();

  return Array.from({ length: lastDay }, (_, index) => index + 1)
    .filter((day) => !datesWithFreeSlots.has(formatDate(year, month, day)))
    .map((day) => new Date(year, month - 1, day));
});

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
  slotToDelete,
  editSlot,
  deleteSlot,
  closeDeleteDialog,
  handleDeletedSlot,
  selectTarget,
  closeRescheduleDialog,
  cancelEditing,
  handleSlotSaved,
} = useExistingSlotActions({
  calendarView,
  selectedDates,
  loadMonthData,
});

const openManualBooking = (slot: SlotDTO) => {
  bookingSlot.value = slot;
};

const handleBookingFormClosed = () => {
  bookingSlot.value = undefined;
};

const handleBookingFormSaved = async () => {
  const slotDate = bookingSlot.value?.date;
  bookingSlot.value = undefined;

  if (slotDate) {
    await loadMonthData(Number(slotDate.slice(0, 4)), slotDate.slice(5, 7));
  }
};

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
