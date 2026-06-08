import { defineStore } from 'pinia'
import type { Slot } from '../types/slot'
import { SlotsApi } from '../api/slots'

type State = {
  slots: Array<Slot>
  loading: boolean
}

export const useSlotsStore = defineStore('slots', {
  state: (): State => ({
    slots: [],
    loading: false,
  }),
  getters: {
    // getActiveSlot
  },
  actions: {
    async loadSlots(month: string) {
      try {
        const slots = await SlotsApi.getSlots(month)

        console.log('slots', slots)

        if (!slots?.length) {
          return;
        }

        this.slots = slots.map((slot) => {
          const [year, month, day] = slot.date.split('-')

          return {
            ...slot,
            date: {
              day: Number(day),
              month: Number(month),
              year: Number(year),
            },
          }
        })
      } catch (error) {}
    },
  },
})
