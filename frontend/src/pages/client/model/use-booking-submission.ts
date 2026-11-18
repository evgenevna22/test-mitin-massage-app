import { ref } from 'vue';
import { ClientSlotsApi } from '../api/client-slots';
import type { BookSlotPayload } from './slot';
import {
  REQUIRED_BOOKING_FORM_FIELDS,
  type BookingFormErrors,
} from './booking-form';
import { useBookingFormStorage } from './use-booking-form-storage';
import { useNotifications } from '@/shared/api';

/** Validates the booking form and submits it through the existing booking API. */
export const useBookingSubmission = () => {
  const notifications = useNotifications();
  const { clearBookingForm, getBookingForm } = useBookingFormStorage();

  const errors = ref<BookingFormErrors>({});
  const isSubmitting = ref(false);
  const isBookingFormValid = ref(false);

  const validateBookingForm = (): boolean => {
    const bookingForm = getBookingForm();
    const nextErrors: BookingFormErrors = {};

    for (const field of REQUIRED_BOOKING_FORM_FIELDS) {
      if (!bookingForm[field].trim()) {
        nextErrors[field] = 'This field is required';
      }
    }

    errors.value = nextErrors;
    isBookingFormValid.value = REQUIRED_BOOKING_FORM_FIELDS.every((field) =>
      Boolean(bookingForm[field].trim())
    );
    return isBookingFormValid.value;
  };

  const handleSubmitBooking = async (): Promise<boolean> => {
    if (isSubmitting.value || !validateBookingForm()) {
      return false;
    }

    const bookingForm = getBookingForm();

    // The backend reads the client identity from verified Telegram data.
    const payload: BookSlotPayload = {
      massageType: bookingForm.massageType.trim(),
      ...(bookingForm.comment?.trim()
        ? { comment: bookingForm.comment.trim() }
        : {}),
      is90MinuteMassage: bookingForm.is90MinuteMassage ?? false,
    };

    isSubmitting.value = true;

    try {
      await ClientSlotsApi.bookSlot(bookingForm.slotId, payload);

      clearBookingForm();

      notifications.add({
        severity: 'success',
        summary: 'Booking request sent',
      });
      return true;
    } catch (error) {
      console.error(error);
      notifications.add({
        severity: 'error',
        summary: "Sorry, your booking wasn't sent",
      });
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    errors,
    handleSubmitBooking,
    isBookingFormValid,
    isSubmitting,
    validateBookingForm,
  };
};
