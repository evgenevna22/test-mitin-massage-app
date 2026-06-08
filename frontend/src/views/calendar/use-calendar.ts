import { computed } from 'vue'
import { useSlotsStore } from '../../stores/slots'

export const useCalendar = () => {
  const slotsStore = useSlotsStore()

  const slots = computed(() => slotsStore.slots)

  return {
    slots,
  }
}
