<template>
  <h3 class="title">Schedule</h3>
  <div class="card" v-for="slot in slotsBySelectedDate" :key="slot.id">
    <SlotCard :upcoming-slot="slot" />
  </div>
</template>

<script setup lang="ts">
import { useSlotsSchedule } from './use-slots-schedule';
import type { AdminScheduleProps } from './types';
import { transformDate } from '@utils';
import SlotCard from '../upcoming-slots/SlotCard.vue';
import { computed } from 'vue';

const props = defineProps<AdminScheduleProps>();

const { slotsByDate } = useSlotsSchedule(props);

const slotsBySelectedDate = computed(() => {
  const slots = slotsByDate.value[transformDate(props.selectedDate)];

  return !slots?.length
    ? []
    : slots.sort((current, next) => (current.time > next.time ? 1 : -1));
});
</script>

<style lang="scss" scoped>
.month-view {
  display: flex;
  flex-direction: column;
}

.upcoming-slots {
  width: max-content;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}
</style>
