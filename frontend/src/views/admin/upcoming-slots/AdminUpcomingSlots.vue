<template>
  <div v-if="slots?.length" class="slots">
    <template v-if="selectedDate">
      <h4 class="title">Записи на {{ getDayFromDate(selectedDate) }}</h4>

      <Card v-for="slot in slots" :key="slot.id">
        <template #content>
          <div class="slot">
            <span class="time">{{ slot.time }}</span>

            <div class="info">
              <p class="name">
                name{{ slot.userName }} <br />
                <span>@{{ slot.userNickname }}</span>
              </p>
              <span class="text">{{
                slot.massageType || 'Тип не указан'
              }}</span>
              <span v-if="slot.comment" class="text">{{ slot.comment }}</span>
            </div>

            <Badge
              :value="confirmationLabel(slot.isConfirmed)"
              :severity="slot.isConfirmed ? 'success' : 'warn'"
            />

            <Button icon="pi pi-chevron-right" size="small" variant="text" />
          </div>
        </template>
      </Card>
    </template>

    <template v-else>
      <div v-for="(slotByDate, date) in slotsByDate" :key="date">
        <h4 class="title">Записи на {{ date }}</h4>
        <Card v-for="slot in slotByDate" :key="slot.id">
          <template #content>
            <div class="slot">
              <span class="time">{{ slot.time }}</span>

              <div class="info">
                <p class="name">
                  name{{ slot.userName }} <br />
                  <span>@{{ slot.userNickname }}</span>
                </p>
                <span class="text">{{
                  slot.massageType || 'Тип не указан'
                }}</span>
                <span v-if="slot.comment" class="text">{{ slot.comment }}</span>
              </div>

              <Badge
                :value="confirmationLabel(slot.isConfirmed)"
                :severity="slot.isConfirmed ? 'success' : 'warn'"
              />

              <Button icon="pi pi-chevron-right" size="small" variant="text" />
            </div>
          </template>
        </Card>
      </div>
    </template>
  </div>
  <div v-else>
    <span class="title">There is no slots for you, hon</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUpcomingSlots } from './use-upcoming-slots';
import { transformDate } from '@utils';
import type { SlotDTO } from '@/types';

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
  upcomingSlots.value.reduce((slots, slot) => {
    if (slots[slot.date] === null || slots[slot.date] === undefined) {
      slots[slot.date] = [];
    }
    slots[slot.date].push(slot);
    
    return slots;
  }, {})
);

const getDayFromDate = (date: Date) => date.getDate();

const confirmationLabel = (isConfirmed: boolean) =>
  isConfirmed ? 'Подтверждена' : 'Не подтверждена';
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

.slot {
  display: flex;
  gap: var(--gap-2x);
  justify-content: center;
  align-items: center;
}

.time,
.name {
  font-size: var(--font-size-subtitle);
  font-weight: 600;
}

.info {
  display: flex;
  flex-direction: column;
}
</style>
