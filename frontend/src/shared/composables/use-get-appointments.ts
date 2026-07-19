import { computed, onMounted, ref } from 'vue'
import { SlotsApi } from '@/api/slots'
import { useSlots } from '.'
import { useSlotsStore } from '@stores/slots'

/**
 * Composable is responsible for:
 * - loading free appointments by selected month
 * - loading free slots for selected day
 */
export const useGetAppointments = () => {
  const today = new Date()
  const currentMonth = ref(String(today.getMonth() + 1).padStart(2, '0'))

  const slotsStore = useSlotsStore()
  const { getSlots } = useSlots()

  const appointments = computed(() => slotsStore.appointments)
  const currentDate = computed(() => slotsStore.currentDate)

  const getAppointments = async (month = currentMonth.value) => {
    if (slotsStore.areAppointmentsLoading) {
      return
    }

    try {
      slotsStore.setAppointmentsLoading(true)
      const appointments = await SlotsApi.getAppointments(month)

      if (!appointments?.length) {
        return
      }

      slotsStore.setAppointments(appointments)
    } finally {
      slotsStore.setAppointmentsLoading(false)
    }
  }

  const selectDate = async (date: string) => {
    if (date === currentDate.value) {
      return
    }

    slotsStore.selectDate(date)
    await getSlots()
  }

  const selectMonth = async (month: number) => {
    currentMonth.value = String(month).padStart(2, '0')

    await getAppointments()
  }

  onMounted(getAppointments)

  return {
    appointments,
    currentDate,
    selectDate,
    getAppointments,
    selectMonth,
  }
}
