<template>
  <div class="master-schedule">
    <h2 class="title">Schedule</h2>
    <span v-if="!slotsBySelectedDate.length">No working slots</span>
    
    <template v-else>
      <div class="card" v-for="slot in slotsBySelectedDate" :key="slot.id">
        <MasterBookingsCard
          :upcoming-slot="slot"
          :is-editing-mode="isEditingMode"
          @create-slot="$emit('create-slot')"
          @edit-slot="$emit('edit-slot', $event)"
          @select-target="$emit('select-target', $event)"
          @delete-slot="$emit('delete-slot')"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useSlotsSchedule } from './use-slots-schedule';
import type { MasterScheduleProps } from './types';
import { transformDate } from '@shared/lib';
import MasterBookingsCard from '../../master-bookings/MasterBookingsCard.vue';
import { computed } from 'vue';

const props = defineProps<MasterScheduleProps>();

defineEmits(['create-slot', 'edit-slot', 'delete-slot', 'select-target']);

const { slotsByDate } = useSlotsSchedule(props);

const slotsBySelectedDate = computed(() => {
  const slots = slotsByDate.value[transformDate(props.selectedDates[0])];

  return !slots?.length
    ? []
    : slots.sort((current, next) => (current.time > next.time ? 1 : -1));
});
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
