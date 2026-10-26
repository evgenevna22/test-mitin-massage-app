<template>
  <Dialog
    :visible="visible"
    :closable="!isDeleting"
    modal
    header="Delete slot"
    @update:visible="handleDialogVisibility"
  >
    <div class="content">
      <template v-if="currentSlot.status === 'free'">
        <p>Are you sure you want to delete your working time?</p>
      </template>
      <template v-else>
        <p>Are you sure you want to delete this slot?</p>
        <div class="booking-details">
          <CopyText :text="username" />
          <span>{{ currentSlot.date }} at {{ currentSlot.time }}</span>
        </div>
      </template>

      <Message v-if="errorMessage" severity="error" :closable="false">
        {{ errorMessage }}
      </Message>

      <div class="buttons">
        <Button
          type="button"
          label="Back"
          severity="secondary"
          :disabled="isDeleting"
          @click="emit('back')"
        />
        <Button
          type="button"
          label="Proceed"
          severity="danger"
          :loading="isDeleting"
          @click="handleConfirmDelete"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { SlotDTO } from '@/pages/master/model/slot';
import { CopyText } from '@/shared/ui';
import axios from 'axios';
import type { BackendError } from '@/shared/model';
import { useMasterSlotDeletion } from './use-master-slot-deletion';

const props = defineProps<{
  visible: boolean;
  currentSlot: SlotDTO;
}>();

const emit = defineEmits<{ back: []; 'slot-deleted': [] }>();

const { deleteSlot } = useMasterSlotDeletion();

const isDeleting = ref(false);
const errorMessage = ref('');

const username = computed(() =>
  props.currentSlot.userNickname
    ? `@${props.currentSlot.userNickname}`
    : (props.currentSlot.userName ?? 'Unknown client')
);

const handleDialogVisibility = (value: boolean) => {
  if (!value && !isDeleting.value) {
    emit('back');
  }
};

const handleConfirmDelete = async () => {
  if (isDeleting.value) {
    return;
  }

  isDeleting.value = true;
  errorMessage.value = '';

  try {
    await deleteSlot(props.currentSlot);
    
    emit('slot-deleted');
  } catch (error) {
    errorMessage.value = axios.isAxiosError<BackendError>(error)
      ? (error.response?.data.error ?? 'Failed to delete slot')
      : error instanceof Error
        ? error.message
        : 'Failed to delete slot';
  } finally {
    isDeleting.value = false;
  }
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: var(--gap-3x);
  min-width: min(320px, 75vw);
  padding-top: var(--gap-2x);
}

.booking-details {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}

.buttons {
  display: flex;
  justify-content: flex-end;
  gap: var(--gap-2x);
}
</style>
