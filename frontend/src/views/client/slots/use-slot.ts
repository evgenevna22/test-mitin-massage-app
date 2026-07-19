import { SlotsApi } from '@/api/slots'
import { useToast } from 'primevue/usetoast'

export const useSlot = () => {
  const toast = useToast()

  const selectSlot = async (id: string) => {
    try {
      await SlotsApi.bookSlot(id)

      toast.add({
        severity: 'success',
        summary: 'Slot was successufully booked',
      })
    } catch (error) {
      console.error(error)
      toast.add({
        severity: 'error',
        summary: "Sorry, slot wasn't booked",
      })
    }
  }

  return {
    selectSlot,
  }
}
