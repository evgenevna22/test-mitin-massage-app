<template>
  <div v-if="slots?.length" class="slots">
    <template v-if="selectedDate">
      <h4 class="title">Appointments for {{ getDayFromDate(selectedDate) }}</h4>

      <template v-for="slot in slots" :key="slot.id">
        <SlotCard :upcoming-slot="slot" />
      </template>
    </template>

    <template v-else>
      <div v-for="(slotByDate, date) in slotsByDate" :key="date">
        <h4 class="title">Appointments for {{ date }}</h4>

        <template v-for="slot in slotByDate" :key="slot.id">
          <SlotCard :upcoming-slot="slot" />
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUpcomingSlots } from './use-upcoming-slots';
import { transformDate } from '@utils';
import type { SlotDTO } from '@/types';
import SlotCard from './SlotCard.vue';

const props = defineProps<{
  selectedDate?: Date;
}>();

const { upcomingSlots } = useUpcomingSlots();

const slots = computed(() => {
  const selectedFullDate = props.selectedDate
    ? transformDate(props.selectedDate)
    : null;

  return selectedFullDate
    ? upcomingSlots.value.filter(({ date }) => date === selectedFullDate)
    : upcomingSlots.value;
});

const slotsByDate = computed<Record<string, SlotDTO[]>>(() =>
  upcomingSlots.value.reduce<Record<string, SlotDTO[]>>((slots, slot) => {
    if (!slots[slot.date]) {
      slots[slot.date] = [];
    }
    slots[slot.date].push(slot);

    return slots;
  }, {})
);

const getDayFromDate = (date: Date) => date.getDate();
</script>

<style lang="scss" scoped>
.title {
  font-size: var(--font-size-subtitle);
}

.slots {
  display: flex;
  flex-direction: column;
  gap: var(--gap-2x);
  justify-content: center;
  flex-wrap: wrap;
}
</style>
