<template>
  <DatePicker
    v-model="datepickerValue"
    :selection-mode="mode"
    :disabled-dates="disabledDates"
    inline
    @month-change="$emit('month-change', $event)"
    @value-change="$emit('date-select', $event)"
  >
    <template #date="{ date: { day, month, year } }">
      <div class="calendar-day">
        <span>{{ day }}</span>

        <div class="day-markers">
          <template
            v-if="
              getDayStatus({ day, month, year }).work ||
              getDayStatus({ day, month, year }).busy
            "
          >
            <i
              v-if="getDayStatus({ day, month, year }).work"
              class="day-marker work"
              title="working day"
            />
            <i
              v-if="getDayStatus({ day, month, year }).busy"
              class="day-marker busy"
              title="busy day"
            />
          </template>

          <i v-else class="day-marker" title="day off" />
        </div>
      </div>
    </template>
  </DatePicker>

  <div class="day-marker-details">
    <span class="day-marker-item">
      <i class="day-marker work" title="working day" /> Has working slots
    </span>
    <span class="day-marker-item">
      <i class="day-marker busy" title="busy day" />
      Has bookings
    </span>
    <span class="day-marker-item">
      <i class="day-marker" title="day off" />
      Day off
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { CalendarProps } from './types';
import { useCalendarStatuses } from './use-calendar-statuses';

const props = withDefaults(defineProps<CalendarProps>(), {
  mode: 'single',
});

defineEmits(['date-select', 'month-change']);

const { getDayStatus } = useCalendarStatuses(props);

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

<style lang="scss" scoped>
.day-markers {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: var(--gap);
}

.day-marker-details,
.day-marker-item {
  display: flex;
  align-items: center;
  gap: var(--gap-2x);
}

.day-marker-item {
  .day-marker {
    margin-top: var(--gap);
  }
}

.day-marker {
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  inset-block-start: 0;
  inset-inline-end: 0;
  transform: translate(50%, -50%);
  transform-origin: 100% 0;
  margin: 0;
  background: var(--gray);

  &.work {
    background: var(--green);
  }
  &.busy {
    background: var(--blue);
  }
}
</style>
