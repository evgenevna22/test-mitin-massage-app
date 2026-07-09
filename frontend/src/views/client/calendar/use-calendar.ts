import type { DatePickerMonthChangeEvent } from 'primevue/datepicker'
import { computed, ref } from 'vue'
import { transformDate } from '@utils'
import { useSlotsStore } from '@stores/slots'

/**
 * Composable is responsible for:
 * - preparing data for displaing available slots for calendar
 */
export const useCalendar = () => {
  const LAST_DAY_OF_MONTH = 0

  const today = new Date()
  const currentMonth = ref(String(today.getMonth() + 1).padStart(2, '0'))
  const currentYear = ref(today.getFullYear())

  const slotsStore = useSlotsStore()

  const appointments = computed(() => slotsStore.appointments)
  const currentDate = computed(() => slotsStore.currentDate)

  const allDaysInMonth = computed<number[]>(() =>
    Array.from(
      {
        length: new Date(
          currentYear.value,
          Number(currentMonth.value),
          LAST_DAY_OF_MONTH
        ).getDate(),
      },
      (_, index: number) => index + 1
    )
  )

  const availableDates = computed<Set<string>>(
    () =>
      /* собираем Set строк "yyyy-mm-dd" только для свободных дней — O(1) на проверку дальше*/
      new Set(
        appointments.value
          .filter((appointment) => appointment.status === 'free')
          .map((appointment) => appointment.date)
      )
  )

  const disabledDates = computed<Date[]>(() =>
    allDaysInMonth.value
      .filter(
        (day) =>
          !availableDates.value.has(
            transformDate(
              new Date(currentYear.value, Number(currentMonth.value) - 1, day)
            )
          )
      )
      .map(
        (day) =>
          new Date(currentYear.value, Number(currentMonth.value) - 1, day)
      )
  )

  const handleMonthChange = ({ month }: DatePickerMonthChangeEvent) => {
    currentMonth.value = String(month).padStart(2, '0')
  }

  return {
    currentDate,
    disabledDates,
    handleMonthChange,
  }
}
