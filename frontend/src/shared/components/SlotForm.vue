<template>
  <Dialog
    modal
    header="Reschedule booking"
    @update:visible="handleVisibility"
  >
    <form class="form" @submit.prevent="$emit('save', comment)">
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
      <div class="buttons">
        <Button
          type="button"
          label="Back"
          severity="secondary"
          @click="$emit('back')"
        />
        <Button type="submit" label="Save" :loading="saving" />
      </div>
    </form>
  </Dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { SlotDTO } from '@/types';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';

const props = defineProps<{
  currentSlot: SlotDTO;
  targetSlot: SlotDTO;
  saving: boolean;
}>();

const emit = defineEmits(['save', 'back']);

const comment = ref(props.currentSlot.comment ?? '');

const telegram = computed(() => `@${props.currentSlot.userNickname ?? ''}`);
const targetSlotLabel = computed(
  () => `${props.targetSlot.date} ${props.targetSlot.time}`
);

const handleVisibility = (value: boolean) => {
  if (!value) {
    emit('back');
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
