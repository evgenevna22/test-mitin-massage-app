import { type Ref, ref } from 'vue';
import type { SlotDTO } from '@/pages/client/model/slot';
import type { CalendarView } from './types';

type Options = {
  calendarView: Ref<CalendarView>;
  selectedDates: Ref<Date[]>;
  loadMonthData: (year: number, month: string) => Promise<void>;
};

export const useExistingSlotActions = ({
  calendarView,
  selectedDates,
  loadMonthData,
}: Options) => {
  const sourceSlot = ref<SlotDTO>();
  const targetSlot = ref<SlotDTO>();
  const slotToDelete = ref<SlotDTO>();

  const editSlot = (slot: SlotDTO) => {
    sourceSlot.value = slot;
    targetSlot.value = undefined;
    calendarView.value = 'editing';
  };

  const deleteSlot = (slot: SlotDTO) => {
    slotToDelete.value = slot;
  };

  const closeDeleteDialog = () => {
    slotToDelete.value = undefined;
  };

  const handleDeletedSlot = async () => {
    const slot = slotToDelete.value;

    if (!slot) {
      return;
    }

    slotToDelete.value = undefined;

    await loadMonthData(Number(slot.date.slice(0, 4)), slot.date.slice(5, 7));

    selectedDates.value = [new Date(`${slot.date}T00:00:00`)];
  };

  const selectTarget = (slot: SlotDTO) => {
    if (slot.status !== 'free' || !sourceSlot.value) {
      return;
    }
    targetSlot.value = slot;
  };

  const closeRescheduleDialog = () => {
    targetSlot.value = undefined;
  };

  const cancelEditing = () => {
    sourceSlot.value = undefined;
    targetSlot.value = undefined;
    calendarView.value = 'default';
  };

  const handleSlotSaved = async () => {
    const target = targetSlot.value;

    if (!target) return;

    await loadMonthData(
      Number(target.date.slice(0, 4)),
      target.date.slice(5, 7)
    );
    selectedDates.value = [new Date(`${target.date}T00:00:00`)];
    cancelEditing();
  };

  return {
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
  };
};
