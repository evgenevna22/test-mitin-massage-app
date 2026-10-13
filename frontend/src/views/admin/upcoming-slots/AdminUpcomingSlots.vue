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
              <span class="text">тип массажа</span>
              <span class="text">comment</span>
            </div>

            <Badge>Подтверждена???</Badge>

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
                <span class="text">тип массажа</span>
                <span class="text">comment</span>
              </div>

              <Badge>Подтверждена???</Badge>

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

const slotsByDate = computed(() => {
  const b = Object.groupBy(upcomingSlots.value, ({ date }) => date);
  console.log('slotsByDate', b);

  return Object.groupBy(upcomingSlots.value, ({ date }) => date);
});

const getDayFromDate = (date: string) => new Date(date).getDate();
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
