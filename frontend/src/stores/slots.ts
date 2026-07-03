import { defineStore } from 'pinia'
import type { SlotDTO } from '../types/slot'

type State = {
  appointments: Array<SlotDTO>
  areAppointmentsLoading: boolean
  currentDate: string
  currentSlots: Array<SlotDTO>
  areCurrentSlotsLoading: boolean
}

export const useSlotsStore = defineStore('slots', {
  state: (): State => ({
    appointments: [],
    areAppointmentsLoading: false,
    currentDate: '',
    currentSlots: [],
    areCurrentSlotsLoading: false,
  }),
  actions: {
    selectDate(date: string) {
      this.currentDate = date
    },

    setAppointments(appointments: SlotDTO[]) {
      this.appointments = appointments
    },

    setAppointmentsLoading(loading: boolean) {
      this.areAppointmentsLoading = loading
    },

    setCurrentSlots(slots: SlotDTO[]) {
      this.currentSlots = slots
    },

    setCurrentSlotsLoading(loading: boolean) {
      this.areCurrentSlotsLoading = loading
    },
  },
})
