import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSlotsStore } from '../../model/slots-store';
import { useSlot } from '../slots/use-slot';
import { useTelegramMiniApp } from '@/shared/api';
import { ClientSlotsApi } from '../../api/client-slots';
import type { MasterDTO } from '../../model';

/** Manages booking form choices, Telegram details, and slot submission. */
export const useBookingForm = (
  masterId: string,
  slotId: string,
  date: string
) => {
  const router = useRouter();
  const slotsStore = useSlotsStore();
  const { selectSlot } = useSlot();
  const { user } = useTelegramMiniApp();

  const massageType = ref('');
  const duration = ref<'60' | '90'>('60');
  const comment = ref('');
  const master = ref<MasterDTO | null>(null);
  const isSubmitting = ref(false);
  const isNinetyMinuteSessionAvailable = computed(() => {
    const slot = slotsStore.currentSlots.find((item) => item.id === slotId);
    return slot?.time === '20:30';
  });
  const selectedSlot = computed(
    () => slotsStore.currentSlots.find((item) => item.id === slotId) ?? null
  );
  const userTelegramUsername = computed(() =>
    user?.username ? `@${user.username}` : 'Telegram username unavailable'
  );
  const masterContact = computed(() => {
    const username = master.value?.telegramUsername;

    if (!username) {
      return 'Not available yet';
    }

    return username.startsWith('@') ? username : `@${username}`;
  });
  const hasMasterUsername = computed(() =>
    Boolean(master.value?.telegramUsername)
  );
  const isFormValid = computed(
    () => Boolean(massageType.value) && Boolean(duration.value)
  );

  const loadFormData = async () => {
    if (slotsStore.selectedMasterId !== masterId) {
      slotsStore.selectMaster(masterId);
    }

    if (!slotsStore.currentSlots.some((slot) => slot.id === slotId)) {
      slotsStore.selectDate(date);
      try {
        slotsStore.setCurrentSlotsLoading(true);
        const slots = await ClientSlotsApi.getSlots(masterId, date);
        slotsStore.setCurrentSlots(slots ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        slotsStore.setCurrentSlotsLoading(false);
      }
    }

    try {
      const masters = await ClientSlotsApi.getMasters();
      master.value = masters.find((item) => item.id === masterId) ?? null;
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitBooking = async () => {
    if (!isFormValid.value || !selectedSlot.value || isSubmitting.value) {
      return;
    }

    isSubmitting.value = true;
    const bookingMassageType = `${massageType.value} (${duration.value} min)`;
    const isBooked = await selectSlot(slotId, {
      massageType: bookingMassageType,
      ...(comment.value.trim() ? { comment: comment.value.trim() } : {}),
    });
    isSubmitting.value = false;

    if (isBooked) {
      await router.push({ name: 'ClientCalendar', params: { masterId } });
    }
  };

  const handleCloseBooking = () => {
    if (window.history.state.back) {
      router.back();
      return;
    }

    router.push({ name: 'ClientCalendar', params: { masterId } });
  };

  return {
    comment,
    duration,
    handleCloseBooking,
    handleSubmitBooking,
    isFormValid,
    hasMasterUsername,
    isNinetyMinuteSessionAvailable,
    isSubmitting,
    loadFormData,
    masterContact,
    massageType,
    selectedSlot,
    userTelegramUsername,
  };
};
