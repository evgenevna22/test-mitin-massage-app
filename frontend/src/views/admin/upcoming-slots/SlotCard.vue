<template>
  <div class="upcoming-card">
    <span class="time">{{ upcomingSlot.time }}</span>

    <div v-if="upcomingSlot.status === 'free'">Free</div>
    <template v-else>
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
        class="status"
        :value="confirmationLabel"
        :severity="upcomingSlot.isConfirmed ? 'success' : 'warn'"
      />
    </template>

    <Button :icon="iconName" size="small" variant="text" />
  </div>
</template>

<script setup lang="ts">
import type { SlotDTO } from '@/types';
import { computed } from 'vue';

const props = defineProps<{
  upcomingSlot: SlotDTO;
}>();

const confirmationLabel = computed(() =>
  props.upcomingSlot.isConfirmed ? 'Confirmed' : 'Not confirmed'
);

const iconName = computed(
  () =>
    `pi ${props.upcomingSlot.status === 'free' ? 'pi-plus' : 'pi-chevron-right'}`
);
</script>

<style lang="scss" scoped>
.upcoming-card {
  display: flex;
  padding: var(--gap-2x);
  gap: var(--gap-2x);
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

.status {
  margin-left: auto;
}
</style>
