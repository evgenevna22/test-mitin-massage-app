<template>
  <Dialog
    :visible="visible"
    :closable="!isSaving"
    modal
    header="Reschedule booking"
    @update:visible="handleDialogVisibility"
  >
    <form class="form" @submit.prevent="handleFormSubmit">
      <FloatLabel variant="on">
        <InputText id="telegram" :model-value="telegram" disabled />
        <label for="telegram">Telegram username</label>
      </FloatLabel>

      <FloatLabel variant="on">
        <InputText id="new-slot" :model-value="targetSlotLabel" disabled />
        <label for="new-slot">New date and time</label>
      </FloatLabel>

      <FloatLabel variant="on">
        <InputText id="reschedule-comment" v-model="comment" maxlength="500" />
        <label for="reschedule-comment">Comment</label>
      </FloatLabel>

      <Message v-if="errorMessage" severity="error" :closable="false">
        {{ errorMessage }}
      </Message>

      <div class="buttons">
        <Button
          type="button"
          label="Back"
          severity="secondary"
          :disabled="isSaving"
          @click="emit('back')"
        />
        <Button type="submit" label="Save" :loading="isSaving" />
      </div>
    </form>
  </Dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { SlotDTO } from '@/shared/model';
import { MasterSlotsApi } from '@/pages/master/api/master-slots';
import { useNotifications } from '@/shared/api';

const props = defineProps<{
  visible: boolean;
  currentSlot: SlotDTO;
  targetSlot: SlotDTO;
}>();

const emit = defineEmits<{
  back: [];
  saved: [];
}>();

const notifications = useNotifications();
const comment = ref(props.currentSlot.comment ?? '');
const isSaving = ref(false);
const errorMessage = ref('');

const telegram = computed(() => `@${props.currentSlot.userNickname ?? ''}`);
const targetSlotLabel = computed(
  () => `${props.targetSlot.date} ${props.targetSlot.time}`
);

const handleDialogVisibility = (value: boolean) => {
  if (!value && !isSaving.value) {
    emit('back');
  }
};

const handleFormSubmit = async () => {
  if (isSaving.value) {
    return;
  }

  isSaving.value = true;
  errorMessage.value = '';

  try {
    await MasterSlotsApi.rescheduleSlot({
      sourceSlotId: props.currentSlot.id,
      targetSlotId: props.targetSlot.id,
      comment: comment.value,
    });

    notifications.add({ severity: 'success', summary: 'Booking rescheduled' });

    emit('saved');
  } catch (error) {
    if (error instanceof Error && 'status' in error) {
      notifications.add({
        severity: 'error',
        summary: error.message,
      });
    }
  } finally {
    isSaving.value = false;
  }
};
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: var(--gap-3x);
  min-width: min(320px, 75vw);
  padding-top: var(--gap-2x);
}

.buttons {
  display: flex;
  justify-content: flex-end;
  gap: var(--gap-2x);
}
</style>
