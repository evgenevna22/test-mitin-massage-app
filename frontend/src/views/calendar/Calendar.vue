<template>
  <img width="60" height="60" src="../assets/max.png" alt="" />

  <DatePicker
    v-model="date"
    inline
    class="w-full sm:w-[30rem]"
    v-if="slots.length"
  >
    <template #date="data">
      <router-link
        :to="`/slots/${data.date.day}`"
        v-bind="$props"
        custom
        v-slot="{ href, navigate }"
      >
        <a
          v-bind="$attrs"
          :href="href"
          @click="navigate"
          :class="{ free: isDayFree(data.date) }"
        >
          {{ data.date.day }}
        </a>
      </router-link>
    </template>
  </DatePicker>
</template>

<script setup lang="ts">
import type { DatePickerDateSlotOptions } from 'primevue'
import { ref } from 'vue'
import { useCalendar } from './use-calendar'

const now = new Date()
const { slots } = useCalendar()

const isDayFree = (date: DatePickerDateSlotOptions) => {
  return (
    slots.value.find(
      (slot) =>
        slot.date.day === date.day &&
        slot.date.month === date.month + 1 &&
        slot.date.year === date.year
    )?.status === 'free'
  )
}

const date = ref(now)
</script>

<style lang="scss">
.free {
  color: red;
}
</style>
