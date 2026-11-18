import { BOOKING_FORM_FIELDS, type BookingForm } from './booking-form';

const BOOKING_FORM_STORAGE_KEY = 'mitin-massage.booking-form';

/** Reads and updates the client booking form in sessionStorage on demand. */
export const useBookingFormStorage = () => {
  const createEmptyBookingForm = (): BookingForm => ({
    slotId: '',
    date: '',
    time: '',
    userName: '',
    massageType: '',
  });

  const removeStoredBookingForm = () => {
    try {
      sessionStorage.removeItem(BOOKING_FORM_STORAGE_KEY);
    } catch {
      // Storage can be unavailable in restricted browser contexts.
    }
  };

  const isBookingForm = (value: unknown): value is BookingForm => {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const storedValues = value as Record<string, unknown>;

    return Object.entries(BOOKING_FORM_FIELDS).every(([field, definition]) => {
      const fieldValue = storedValues[field];

      if (fieldValue === undefined && !definition.required) {
        return true;
      }

      return typeof fieldValue === definition.type;
    });
  };

  const getBookingForm = (): BookingForm => {
    try {
      const storedBookingForm = sessionStorage.getItem(
        BOOKING_FORM_STORAGE_KEY
      );

      if (!storedBookingForm) {
        return createEmptyBookingForm();
      }

      const parsedBookingForm: unknown = JSON.parse(storedBookingForm);

      if (isBookingForm(parsedBookingForm)) {
        return {
          ...createEmptyBookingForm(),
          ...parsedBookingForm,
        };
      }
    } catch {
      removeStoredBookingForm();
      return createEmptyBookingForm();
    }

    removeStoredBookingForm();
    return createEmptyBookingForm();
  };

  const saveBookingForm = (bookingForm: BookingForm): boolean => {
    try {
      sessionStorage.setItem(
        BOOKING_FORM_STORAGE_KEY,
        JSON.stringify(bookingForm)
      );
      return true;
    } catch {
      return false;
    }
  };

  const updateBookingForm = (updates: Partial<BookingForm>): BookingForm => {
    const bookingForm = {
      ...getBookingForm(),
      ...updates,
    };

    saveBookingForm(bookingForm);
    return bookingForm;
  };

  const clearBookingForm = () => {
    removeStoredBookingForm();
  };

  return {
    getBookingForm,
    updateBookingForm,
    clearBookingForm,
  };
};
