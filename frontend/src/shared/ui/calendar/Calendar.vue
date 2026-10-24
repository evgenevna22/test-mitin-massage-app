<template>
  <DatePicker
    v-model="datepickerValue"
    :selection-mode="mode"
    :disabled-dates="disabledDates"
    inline
    :min-date="minDate"
    @month-change="$emit('month-change', $event)"
    @value-change="$emit('date-select', $event)"
  >
    <template #date="{ date: { day, month, year } }">
      <slot name="date" :date="{ day, month, year }">
        {{ day }}
      </slot>
    </template>
  </DatePicker>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { CalendarProps } from './types';

type CalendarDate = { day: number; month: number; year: number };

const props = withDefaults(defineProps<CalendarProps>(), {
  mode: 'single',
});

defineEmits(['date-select', 'month-change']);
defineSlots<{
  date(props: { date: CalendarDate }): unknown;
}>();

const today = new Date();

const selectedDay = ref<Date>(today);
const selectedDays = ref<Date[]>([]);

const datepickerValue = computed<Date | Date[]>({
  get: () => (props.mode === 'single' ? selectedDay.value : selectedDays.value),

  set: (value) => {
    if (props.mode === 'single' && value instanceof Date) {
      selectedDay.value = value;
    } else if (props.mode === 'multiple' && Array.isArray(value)) {
      selectedDays.value = value;
    }
  },
});
</script>
