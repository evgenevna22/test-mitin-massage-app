<template>
  <img width="60" height="60" src="./../../../assets/max.png" alt="" />

  <DatePicker
    v-if="appointments.length"
    class="calendar w-full sm:w-[30rem]"
    v-model="selectedDate"
    :minDate="today"
    :disabled-dates="disabledDates"
    inline
    @date-select="handleDateSelect"
    @month-change="handleMonthChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { transformDate } from '@utils'
import { useCalendar } from './use-calendar'
import { useGetAppointments } from '@composables'
import type { DatePickerMonthChangeEvent } from 'primevue'

const today = new Date()

const router = useRouter()

const { disabledDates, selectCurrentMonth } = useCalendar()
const { appointments, selectDate, selectMonth } = useGetAppointments()

const selectedDate = ref(today)

const handleDateSelect = async () => {
  const transformedDate = transformDate(selectedDate.value)

  await selectDate(transformedDate)

  router.push(`/slots/${transformedDate}`)
}

const handleMonthChange = ({ month }: DatePickerMonthChangeEvent) => {
  selectCurrentMonth(month)
  selectMonth(month)
}
</script>

<style lang="scss" scoped>
.date {
  color: rgba(0, 0, 0, 0.3);
  cursor: default;
}

.available {
  display: inline-block;
  min-width: 30px;
  min-height: 30px;
  padding: 2px;
  line-height: 24px;
  border-radius: 50%;
  background-color: rgba(138, 43, 226, 0.3);
  color: black;
  cursor: pointer;
  transition: background-color color 0.5s;

  &:hover {
    color: rgba(0, 0, 0, 0.7);
    background-color: rgba(138, 43, 226, 0.6);
  }
}

.calendar {
  max-width: 400px;
  margin: 0 auto;
}
</style>
