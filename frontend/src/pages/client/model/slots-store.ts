import { defineStore } from 'pinia';
import type { ClientSlotDTO } from './slot';

type State = {
  appointments: Array<ClientSlotDTO>;
  areAppointmentsLoading: boolean;
  selectedMasterId: string;
  selectedDate: string;
  currentSlots: Array<ClientSlotDTO>;
  areCurrentSlotsLoading: boolean;
};

export const useSlotsStore = defineStore('slots-store', {
  state: (): State => ({
    appointments: [],
    areAppointmentsLoading: false,
    selectedMasterId: '',
    selectedDate: '',
    currentSlots: [],
    areCurrentSlotsLoading: false,
  }),
  actions: {
    selectMaster(masterId: string) {
      this.selectedMasterId = masterId;
      this.appointments = [];
      this.currentSlots = [];
      this.selectedDate = '';
    },

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
