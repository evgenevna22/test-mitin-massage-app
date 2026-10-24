<template>
  <div v-if="slots?.length" class="upcoming-slots">
    <template v-if="selectedDate">
      <h4 class="title">Appointments for {{ getDayFromDate(selectedDate) }}</h4>
      <template v-for="slot in slots" :key="slot.id">
        <MasterBookingsCard
          class="slot-card"
          :upcoming-slot="slot"
          :action-buttons-available="false"
        />
      </template>
    </template>

    <template v-else>
      <div v-for="(slotByDate, date) in slotsByDate" :key="date">
        <h4 class="title">Appointments for {{ date }}</h4>

        <template v-for="slot in slotByDate" :key="slot.id">
          <MasterBookingsCard
            class="slot-card"
            :upcoming-slot="slot"
            :action-buttons-available="false"
          />
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMasterBookingsLoader } from './use-master-bookings-loader';
import { transformDate } from '@shared/lib';
import type { SlotDTO } from '@/shared/model';
import MasterBookingsCard from './MasterBookingsCard.vue';

const props = defineProps<{
  selectedDate?: Date;
}>();

const { upcomingSlots } = useMasterBookingsLoader();

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

.slot-card {
  padding: 0 var(--gap-2x);
  border-radius: var(--gap-2x);
  background: var(--background-surface);
  border: 1px solid var(--border-surface);
}
</style>
