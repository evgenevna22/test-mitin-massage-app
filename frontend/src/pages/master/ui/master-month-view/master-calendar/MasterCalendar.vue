<template>
  <div class="master-calendar">
    <Calendar
      :mode="mode"
      :min-date="minDate"
      :disabled-dates="disabledDates"
      @date-select="$emit('date-select', $event)"
      @month-change="$emit('month-change', $event)"
    >
      <template #date="{ date }">
        <div class="calendar-day">
          <span>{{ date.day }}</span>
          <div class="day-markers">
            <template v-if="getDayStatus(date).work || getDayStatus(date).busy">
              <i
                v-if="getDayStatus(date).work"
                class="day-marker work"
                title="working day"
              />
              <i
                v-if="getDayStatus(date).busy"
                class="day-marker busy"
                title="busy day"
              />
            </template>
            <i v-else class="day-marker" title="day off" />
          </div>
        </div>
      </template>
    </Calendar>

    <div class="day-marker-details">
      <span class="day-marker-item">
        <i class="day-marker work" title="working day" /> Has working slots
      </span>
      <span class="day-marker-item">
        <i class="day-marker busy" title="busy day" /> Has bookings
      </span>
      <span class="day-marker-item">
        <i class="day-marker" title="day off" /> Day off
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import Calendar from '@/shared/ui/calendar/Calendar.vue';
import type { CalendarProps } from '@/shared/ui/calendar/types';
import type { MonthOccupancy } from '@/pages/master/model';

type CalendarDay = { day: number; month: number; year: number };

const props = withDefaults(
  defineProps<
    Pick<CalendarProps, 'mode'> & {
      monthOccupancy: MonthOccupancy;
      visibleMonth: { year: number; month: number };
      disabledDates?: Date[];
      minDate?: Date;
    }
  >(),
  {
    mode: 'single',
  }
);

const emit = defineEmits<{
  'date-select': [value: Date | Date[]];
  'month-change': [value: { month: number; year: number }];
}>();

const workingDateSet = computed(
  () => new Set(props.monthOccupancy.workingDates)
);
const bookedDateSet = computed(() => new Set(props.monthOccupancy.bookedDates));

const getDayStatus = ({ day, month, year }: CalendarDay) => {
  const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  return {
    work: workingDateSet.value.has(key),
    busy: bookedDateSet.value.has(key),
  };
};

onMounted(() => {
  const today = new Date();

  emit('date-select', today);
});
</script>

<style lang="scss" scoped>
.master-calendar {
  display: flex;
  flex-direction: column;
  gap: var(--gap-2x);
}

.calendar-day {
  position: relative;
}

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

.day-marker-item .day-marker {
  margin-top: var(--gap);
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
