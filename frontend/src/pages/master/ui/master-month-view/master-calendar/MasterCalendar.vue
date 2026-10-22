<template>
  <div class="master-calendar">
    <Calendar
      :mode="mode"
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
import { computed } from 'vue';
import Calendar from '@/shared/ui/calendar/Calendar.vue';
import type { CalendarProps } from '@/shared/ui/calendar/types';
import type { MonthOccupancy } from '@/pages/master/model';

type CalendarDay = { day: number; month: number; year: number };
type CalendarView = 'creating' | 'editing' | 'default';

const props = withDefaults(
  defineProps<
    Pick<CalendarProps, 'mode'> & {
      monthOccupancy: MonthOccupancy;
      viewMode: CalendarView;
      visibleMonth: { year: number; month: number };
    }
  >(),
  { mode: 'single' }
);

defineEmits<{
  'date-select': [value: Date | Date[]];
  'month-change': [value: { month: number; year: number }];
}>();

const workingDateSet = computed(
  () => new Set(props.monthOccupancy.workingDates)
);
const bookedDateSet = computed(() => new Set(props.monthOccupancy.bookedDates));
const disabledDates = computed<Date[]>(() => {
  if (props.viewMode === 'creating') {
    return props.monthOccupancy.workingDates.map(
      (date) => new Date(`${date}T00:00:00`)
    );
  }

  if (props.viewMode !== 'editing') {
    return [];
  }

  const { year, month } = props.visibleMonth;
  const datesWithFreeSlots = new Set(props.monthOccupancy.datesWithFreeSlots);
  const lastDay = new Date(year, month, 0).getDate();

  return Array.from({ length: lastDay }, (_, index) => index + 1)
    .filter(
      (day) =>
        !datesWithFreeSlots.has(
          `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        )
    )
    .map((day) => new Date(year, month - 1, day));
});

const getDayStatus = ({ day, month, year }: CalendarDay) => {
  const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  return {
    work: workingDateSet.value.has(key),
    busy: bookedDateSet.value.has(key),
  };
};
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
