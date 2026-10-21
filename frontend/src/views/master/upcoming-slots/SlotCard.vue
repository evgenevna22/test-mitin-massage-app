<template>
  <div class="slot-card">
    <span class="time">{{ upcomingSlot.time }}</span>

    <div v-if="upcomingSlot.status === 'free'">Free</div>
    <template v-else>
      <div class="info">
        <p class="name">
          name{{ upcomingSlot.userName }} <br />
          <span>@{{ upcomingSlot.userNickname }}</span>
        </p>
        <span v-if="upcomingSlot.massageType" class="text">
          {{ upcomingSlot.massageType }}
        </span>
        <span v-if="upcomingSlot.comment" class="text">
          {{ upcomingSlot.comment }}
        </span>
      </div>

      <Badge
        class="status"
        :value="confirmationLabel"
        :severity="upcomingSlot.isConfirmed ? 'success' : 'warn'"
      />
    </template>

    <Button
      v-if="!isEditingMode || upcomingSlot.status === 'free'"
      class="action-button"
      :icon="iconName"
      rounded
      :disabled="isEditingMode && upcomingSlot.status !== 'free'"
      @click="handleButtonClick"
    />
  </div>
</template>

<script setup lang="ts">
import type { SlotDTO } from '@/types';
import { computed } from 'vue';
import { useConfirm } from 'primevue/useconfirm';

const props = defineProps<{
  upcomingSlot: SlotDTO;
  isEditingMode?: boolean;
}>();

const emits = defineEmits([
  'create-slot',
  'edit-slot',
  'delete-slot',
  'select-target',
]);

const confirm = useConfirm();

const confirmationLabel = computed(() =>
  props.upcomingSlot.isConfirmed ? 'Confirmed' : 'Not confirmed'
);

const iconName = computed(
  () =>
    `pi ${props.upcomingSlot.status === 'free' ? 'pi-plus' : 'pi-chevron-right'}`
);

const handleButtonClick = () => {
  if (props.isEditingMode) {
    emits('select-target', props.upcomingSlot);
    return;
  }
  confirm.require({
    header: 'Slot details',
    rejectProps: {
      label: 'Delete',
      severity: 'danger',
    },
    acceptProps: {
      label: 'Edit',
    },
    reject: () => {
      emits('delete-slot', props.upcomingSlot);
    },
    accept: () => {
      emits('edit-slot', props.upcomingSlot);
    },
  });
};
</script>

<style lang="scss" scoped>
.slot-card {
  display: flex;
  padding: var(--gap-2x) 0;
  gap: var(--gap-2x);
  align-items: center;
}

.time {
  width: 15%;
}

.name {
  width: 40%;
}

.status {
  width: auto;
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

.status,
.action-button {
  margin-left: auto;
}
</style>
