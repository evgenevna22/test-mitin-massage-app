import { SlotsApi } from '../../api/slots'
import { useToast } from 'primevue/usetoast'
import { useSlotsStore } from '../../stores/slots'

export const useSlots = () => {
  const toast = useToast()
  const slotsStore = useSlotsStore()

  const getSlots = async () => {
    if (slotsStore.areCurrentSlotsLoading || !slotsStore.currentDate) {
      return
    }

    try {
      slotsStore.setCurrentSlotsLoading(true)
      const slots = await SlotsApi.getSlots(slotsStore.currentDate)

      if (!slots?.length) {
        throw Error
      }

      slotsStore.setCurrentSlots(slots)
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Данные по дню не были загружены',
      })
    } finally {
      slotsStore.setCurrentSlotsLoading(false)
    }
  }

  return {
    getSlots,
  }
}
