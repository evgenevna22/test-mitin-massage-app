import { defineStore } from 'pinia';
import type { ClientSlotDTO } from '../types/slot';

type State = {
  appointments: Array<ClientSlotDTO>;
  areAppointmentsLoading: boolean;
  selectedDate: string;
  currentSlots: Array<ClientSlotDTO>;
  areCurrentSlotsLoading: boolean;
};

export const useSlotsStore = defineStore('slots-store', {
  state: (): State => ({
    appointments: [],
    areAppointmentsLoading: false,
    selectedDate: '',
    currentSlots: [],
    areCurrentSlotsLoading: false,
  }),
  actions: {
    selectDate(date: string) {
      this.selectedDate = date;
    },

    setAppointments(appointments: ClientSlotDTO[]) {
      this.appointments = appointments;
    },

    setAppointmentsLoading(loading: boolean) {
      this.areAppointmentsLoading = loading;
    },

    setCurrentSlots(slots: ClientSlotDTO[]) {
      this.currentSlots = slots;
    },

    setCurrentSlotsLoading(loading: boolean) {
      this.areCurrentSlotsLoading = loading;
    },
  },
});
