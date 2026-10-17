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

      <span v-if="!isTimeSlotsValid" class="invalid-message"
        >Set correct time intervals: the start time must be earlier than end
        time</span
      >
      <span v-else-if="serverError" class="invalid-message">{{ serverError }}</span>

      <div class="action-buttons">
        <Button
          class="action-button"
          icon="pi pi-plus"
          label="Save"
          size="large"
          type="submit"
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
import { computed, reactive, ref, watch } from 'vue';
import type { TimeSlot } from '@/types';
import { transformDate } from '@utils';

const TIME_PLACEHOLDER = '00:00';

const getInitialTimeSlotState = (): TimeSlot => ({
  start: TIME_PLACEHOLDER,
  end: TIME_PLACEHOLDER,
});

const props = defineProps<{
  selectedDates: Date[];
  serverError?: string;
}>();

const emits = defineEmits(['create', 'return']);

const timeSlot = reactive(getInitialTimeSlotState());

const isTimeSlotsValidR = ref();

const isTimeSlotsValid = computed(() => {
  const isEmpty = Object.values(timeSlot).every(
    (slot) => slot === TIME_PLACEHOLDER
  );

  const isValidRange = timeSlot.end > timeSlot.start;
  return !isEmpty && isValidRange;
});

const isFormValid = computed(() => {
  return Boolean(props.selectedDates.length && isTimeSlotsValid.value);
});

const handleSubmit = async () => {
  if (!isFormValid.value) {
    return;
  }

  emits('create', timeSlot);
};

watch(
  isTimeSlotsValid,
  (value) => {
    isTimeSlotsValidR.value = value;
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;
  padding: var(--gap-2x);
  border: 1px solid #efeae0;
  border-radius: var(--gap-2x);
  background: #faf9f6;
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
