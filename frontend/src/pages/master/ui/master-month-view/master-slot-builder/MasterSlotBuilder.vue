<template>
  <div class="card">
    <div class="dates">
      <h3>Dates:</h3>
      <div class="dates-list">
        <Badge
          v-for="date in selectedDates"
          :key="date.getTime()"
          :value="transformDate(date)"
          severity="info"
        />
      </div>
    </div>

    <form class="form" @submit.prevent="handleSubmit">
      <label class="label" for="start"> Start time </label>
      <InputText
        v-model="timeSlot.start"
        type="time"
        placeholder="00:00"
        id="start"
        :invalid="!isTimeSlotsValid"
      />

      <label class="label" for="end"> End time </label>
      <InputText
        v-model="timeSlot.end"
        type="time"
        placeholder="00:00"
        id="end"
        :invalid="!isTimeSlotsValid"
      />

      <span v-if="!isTimeSlotsValid" class="invalid-message">
        Set correct time intervals: the start time must be earlier than end time
      </span>
      <span v-else-if="serverError" class="invalid-message">
        {{ serverError }}
      </span>

      <div class="action-buttons">
        <Button
          class="action-button"
          icon="pi pi-plus"
          label="Save"
          size="large"
          type="submit"
          :loading="isLoading"
          :disabled="!isFormValid"
        />
        <Button
          class="action-button"
          icon="pi pi-angle-left"
          label="Return"
          size="large"
          severity="danger"
          @click="$emit('return')"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import type { TimeSlot } from '@/shared/model';
import { transformDate } from '@shared/lib';
import { useWorkSlotCreation } from './use-work-slot-creation';

const TIME_PLACEHOLDER = '00:00';

const getInitialTimeSlotState = (): TimeSlot => ({
  start: TIME_PLACEHOLDER,
  end: TIME_PLACEHOLDER,
});

const props = defineProps<{
  selectedDates: Date[];
}>();

const emits = defineEmits(['created', 'return']);

const timeSlot = reactive(getInitialTimeSlotState());

const { serverError, isLoading, saveWorkSlots } = useWorkSlotCreation();

const isTimeSlotsValid = computed(() => {
  const isEmpty = Object.values(timeSlot).every(
    (slot) => slot === TIME_PLACEHOLDER
  );

  const isValidRange = timeSlot.end > timeSlot.start;
  return !isEmpty && isValidRange;
});

const isFormValid = computed(() =>
  Boolean(props.selectedDates.length && isTimeSlotsValid.value)
);

const handleSubmit = async () => {
  if (!isFormValid.value) {
    return;
  }

  await saveWorkSlots(props.selectedDates, timeSlot);

  if (serverError.value) {
    return;
  }

  emits('created');
};
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;
  padding: var(--gap-2x);
  border: 1px solid var(--border-surface);
  border-radius: var(--gap-2x);
  background: var(--background-surface);
}

.dates {
  display: flex;
  align-items: center;
  gap: var(--gap-2x);
}

.dates-list {
  display: flex;
  gap: var(--gap);
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--gap-2x);
  width: 100%;
  padding: var(--gap-3x) 0;
}

.invalid-message {
  font-size: x-small;
  color: var(--red);
}
</style>
