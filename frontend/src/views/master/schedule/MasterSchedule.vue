<template>
  <div class="master-schedule">
    <h2 class="title">Schedule</h2>
    <span v-if="!slotsBySelectedDate.length">No working slots</span>
    <template v-else>
      <div class="card" v-for="slot in slotsBySelectedDate" :key="slot.id">
        <SlotCard
          :upcoming-slot="slot"
          @create-slot="handleSlotCreate"
          @edit-slot="handleSlotEdit"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useSlotsSchedule } from './use-slots-schedule.ts';
import type { MasterScheduleProps } from './types.ts';
import { transformDate } from '@utils';
import SlotCard from '../upcoming-slots/SlotCard.vue';
import { computed } from 'vue';

const props = defineProps<MasterScheduleProps>();

const { slotsByDate } = useSlotsSchedule(props);

const slotsBySelectedDate = computed(() => {
  const slots = slotsByDate.value[transformDate(props.selectedDates[0])];

  return !slots?.length
    ? []
    : slots.sort((current, next) => (current.time > next.time ? 1 : -1));
});

const handleSlotCreate = () => {};
const handleSlotEdit = () => {};
</script>

<style lang="scss" scoped>
.master-schedule {
  padding: var(--gap-2x);
  border: 1px solid var(--border-surface);
  border-radius: var(--gap-2x);
  background: var(--background-surface);
}

.title {
  padding: var(--gap-2x) 0;
}

.card {
  border-top: 1px solid var(--border-surface);
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}
</style>
