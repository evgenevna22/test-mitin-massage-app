<template>
  <Dialog
    :visible="visible"
    modal
    header="Create booking"
    @update:visible="!$event && emit('close')"
  >
    <form class="form" @submit.prevent="handleSubmitForm">
      <FloatLabel variant="on">
        <InputText
          id="booking-date"
          v-model="fields.date.value"
          type="date"
          :disabled="fields.date.disabled"
          required
        />
        <label for="booking-date">Date</label>
      </FloatLabel>
      <FloatLabel variant="on">
        <InputText
          id="booking-time"
          v-model="fields.time.value"
          type="time"
          :disabled="fields.time.disabled"
          required
        />
        <label for="booking-time">Time</label>
      </FloatLabel>
      <FloatLabel variant="on">
        <InputText
          id="booking-user"
          v-model="fields.userId.value"
          inputmode="numeric"
          :disabled="fields.userId.disabled"
          required
        />
        <label for="booking-user">Telegram user ID</label>
      </FloatLabel>
      <FloatLabel variant="on">
        <InputText
          id="booking-user"
          v-model="fields.userName.value"
          :disabled="fields.userName.disabled"
          required
        />
        <label for="booking-user">Telegram username</label>
      </FloatLabel>
      <FloatLabel variant="on">
        <InputText
          id="booking-type"
          v-model="fields.massageType.value"
          maxlength="100"
          :disabled="fields.massageType.disabled"
          required
        />
        <label for="booking-type">Massage type</label>
      </FloatLabel>
      <FloatLabel variant="on">
        <InputText
          id="booking-comment"
          v-model="fields.comment.value"
          maxlength="500"
          :disabled="fields.comment.disabled"
        />
        <label for="booking-comment">Comment</label>
      </FloatLabel>

      <Message v-if="errorMessage" severity="error" :closable="false"
        >{{ errorMessage }}
      </Message>

      <div class="buttons">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          :disabled="isFormSubmitting"
          @click="emit('close')"
        /><Button type="submit" label="Create" :loading="isFormSubmitting" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { MasterSlotsApi } from '@/pages/master/api/master-slots';
import { useNotifications } from '@/shared/api';
import type { SlotDTO } from '@/pages/master/model/slot';

const props = defineProps<{ visible: boolean; bookingSlot: SlotDTO }>();

const emit = defineEmits<{ close: []; saved: [] }>();

const notifications = useNotifications();

const isFormSubmitting = ref(false);
const errorMessage = ref('');

const fields = reactive({
  date: {
    value: props.bookingSlot.date,
    disabled: true,
  },
  time: {
    value: props.bookingSlot.time,
    disabled: true,
  },
  userId: {
    value: '',
    disabled: false,
  },
  userName: {
    value: '',
    disabled: false,
  },
  massageType: {
    value: '',
    disabled: false,
  },
  comment: {
    value: '',
    disabled: false,
  },
});

const handleSubmitForm = async () => {
  const userId = Number(fields.userId.value);

  if (userId <= 0) {
    errorMessage.value = 'Enter a valid Telegram user ID';
    return;
  }

  isFormSubmitting.value = true;
  errorMessage.value = '';

  try {
    await MasterSlotsApi.createManualBooking({
      date: fields.date.value,
      time: fields.time.value,
      userId,
      userName: fields.userName.value,
      massageType: fields.massageType.value,
      comment: fields.comment.value || undefined,
    });

    notifications.add({ severity: 'success', summary: 'Booking created' });

    emit('saved');
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Failed to create booking';
  } finally {
    isFormSubmitting.value = false;
  }
};
</script>

<style scoped>
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
