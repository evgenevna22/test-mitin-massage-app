import { ref } from 'vue'
import { SlotsApi } from '@/api/slots'
import { useToast } from 'primevue/usetoast'
import type { TimeSlot } from '@/types'
import { transformDate } from '@utils'

export const useSlots = () => {
  const toast = useToast()

  const isLoading = ref(false)

  const createSlot = async (dates: Date[], time: TimeSlot) => {
    if (isLoading.value) {
      return
    }
    isLoading.value = true

    try {
      const transformedDates = dates.map(transformDate)
      await SlotsApi.createSlot({ dates: transformedDates, time })
      toast.add({ severity: 'success', summary: "slots're saved" })
    } catch (error) {
      console.error(error)
      toast.add({ severity: 'error', summary: "slots haven't been saved" })
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    createSlot,
  }
}
