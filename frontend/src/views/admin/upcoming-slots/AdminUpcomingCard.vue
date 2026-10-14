<template>
  <Card>
    <template #content>
      <div class="slot">
        <span class="time">{{ upcomingSlot.time }}</span>

        <div class="info">
          <p class="name">
            name{{ upcomingSlot.userName }} <br />
            <span>@{{ upcomingSlot.userNickname }}</span>
          </p>
          <span class="text">{{
            upcomingSlot.massageType || 'Тип не указан'
          }}</span>
          <span v-if="upcomingSlot.comment" class="text">{{
            upcomingSlot.comment
          }}</span>
        </div>

        <Badge
          :value="confirmationLabel(upcomingSlot.isConfirmed)"
          :severity="upcomingSlot.isConfirmed ? 'success' : 'warn'"
        />

        <Button icon="pi pi-chevron-right" size="small" variant="text" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { SlotDTO } from '@/types';

defineProps<{
  upcomingSlot: SlotDTO;
}>();

const confirmationLabel = (isConfirmed: boolean) =>
  isConfirmed ? 'Confirmed' : 'Not confirmed';
</script>

<style lang="scss" scoped>
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
