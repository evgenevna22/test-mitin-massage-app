<template>
  <Dialog
    :visible="true"
    modal
    :closable="false"
    :draggable="false"
    class="booking-dialog"
    @update:visible="handleCloseBooking"
  >
    <template #header>
      <div class="dialog-heading">
        <Button
          class="back-button"
          icon="pi pi-arrow-left"
          aria-label="Close booking form"
          text
          @click="handleCloseBooking"
        />
        <div>
          <p class="eyebrow">ALMOST YOURS</p>
          <h1>Book a massage</h1>
        </div>
      </div>
    </template>

    <div class="booking-form-content">
      <section class="selected-session">
        <div class="selected-session__icon">
          <i class="pi pi-calendar" aria-hidden="true" />
        </div>
        <div>
          <p class="selected-session__label">Selected session</p>
          <p class="selected-session__date">{{ sessionDateLabel }}</p>
          <p class="selected-session__time">
            {{ selectedSlot?.time ?? 'Loading time…' }}
            <span>· {{ duration }} min</span>
          </p>
        </div>
      </section>

      <form class="booking-form" @submit.prevent="handleSubmitBooking">
        <div class="form-field">
          <label for="client-telegram">Your Telegram username</label>
          <InputText
            id="client-telegram"
            :model-value="userTelegramUsername"
            disabled
          />
        </div>

        <div class="form-field">
          <label for="master-telegram">Master Telegram username</label>
          <div class="contact-input">
            <InputText
              id="master-telegram"
              :model-value="masterContact"
              disabled
            />
            <CopyText
              v-if="hasMasterUsername"
              class="contact-input__copy"
              :text="masterContact"
            />
          </div>
          <small class="field-note">
            The master username is not provided by the booking service yet.
          </small>
        </div>

        <fieldset class="choice-fieldset">
          <legend>Massage type</legend>
          <div class="choice-grid">
            <label
              v-for="option in massageOptions"
              :key="option.value"
              class="choice-card"
              :class="{ 'choice-card--selected': massageType === option.value }"
            >
              <RadioButton
                v-model="massageType"
                :input-id="`massage-${option.value}`"
                name="massage-type"
                :value="option.value"
              />
              <span>{{ option.label }}</span>
            </label>
          </div>
        </fieldset>

        <fieldset class="choice-fieldset duration-fieldset">
          <legend>Session length</legend>
          <div class="duration-options">
            <label
              class="duration-option"
              :class="{ 'duration-option--selected': duration === '60' }"
            >
              <RadioButton
                v-model="duration"
                input-id="duration-60"
                name="duration"
                value="60"
              />
              <span>60 min</span>
            </label>
            <label
              class="duration-option"
              :class="{
                'duration-option--selected': duration === '90',
                'duration-option--disabled': !isNinetyMinuteSessionAvailable,
              }"
            >
              <RadioButton
                v-model="duration"
                input-id="duration-90"
                name="duration"
                value="90"
                :disabled="!isNinetyMinuteSessionAvailable"
              />
              <span>90 min</span>
            </label>
          </div>
          <small class="field-note">
            90-minute sessions are available only for the 20:30 time slot.
          </small>
        </fieldset>

        <div class="form-field">
          <label for="booking-comment">
            Comment <span class="optional-label">(optional)</span>
          </label>
          <Textarea
            id="booking-comment"
            v-model="comment"
            auto-resize
            rows="4"
            placeholder="Share a preference or anything that would help us prepare."
          />
        </div>

        <Button
          class="submit-button"
          type="submit"
          label="Confirm booking"
          icon="pi pi-arrow-right"
          icon-pos="right"
          :disabled="!isFormValid || !selectedSlot"
          :loading="isSubmitting"
        />
      </form>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { CopyText } from '@/shared/ui';
import { useBookingForm } from './use-booking-form';

const route = useRoute();
const masterId = String(route.params.masterId);
const slotId = String(route.params.slotId);
const date = String(route.params.date);

const massageOptions = [
  { label: 'Classic', value: 'Classic massage' },
  { label: 'Relax', value: 'Relax massage' },
  { label: 'Legs', value: 'Leg massage' },
  { label: 'Back', value: 'Back massage' },
];

const {
  comment,
  duration,
  handleCloseBooking,
  handleSubmitBooking,
  hasMasterUsername,
  isFormValid,
  isNinetyMinuteSessionAvailable,
  isSubmitting,
  loadFormData,
  masterContact,
  massageType,
  selectedSlot,
  userTelegramUsername,
} = useBookingForm(masterId, slotId, date);

const sessionDateLabel = computed(() => {
  const sessionDate = new Date(`${date}T12:00:00`);

  if (Number.isNaN(sessionDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(sessionDate);
});

onMounted(loadFormData);
</script>

<style lang="scss" scoped>
.booking-dialog {
  width: min(100%, 560px);
  max-height: 100svh;
  margin: 0;
  border: 0;
  border-radius: 0;
  background: var(--color-client-background);
  color: #fff;
}

.booking-dialog :deep(.p-dialog-header) {
  align-items: flex-start;
  padding: 18px 18px 12px;
  background: var(--color-client-background);
  color: #fff;
}

.booking-dialog :deep(.p-dialog-content) {
  padding: 0 18px 24px;
  background: var(--color-client-background);
  color: #fff;
}

.dialog-heading {
  display: flex;
  align-items: center;
  gap: 10px;
}

.back-button {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  color: #fff;
}

.eyebrow {
  color: var(--color-client-orange);
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.16em;
}

.dialog-heading h1 {
  margin-top: 3px;
  font-size: 23px;
  font-weight: 600;
  letter-spacing: -0.05em;
}

.booking-form-content {
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.selected-session {
  display: flex;
  gap: 12px;
  padding: 16px;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 18px;
  background: #111313;
}

.selected-session__icon {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  background: rgb(0 148 255 / 14%);
  color: var(--color-client-blue);
}

.selected-session__label {
  margin-bottom: 3px;
  color: rgb(255 255 255 / 48%);
  font-size: 12px;
}

.selected-session__date {
  font-size: 14px;
  font-weight: 550;
}

.selected-session__time {
  margin-top: 2px;
  font-size: 18px;
  font-weight: 650;
}

.selected-session__time span {
  color: rgb(255 255 255 / 54%);
  font-size: 14px;
  font-weight: 400;
}

.booking-form {
  display: grid;
  gap: 20px;
  padding-top: 22px;
}

.form-field,
.choice-fieldset {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.form-field label,
.choice-fieldset legend {
  color: rgb(255 255 255 / 88%);
  font-size: 13px;
  font-weight: 550;
}

.form-field :deep(.p-inputtext),
.form-field :deep(.p-textarea) {
  width: 100%;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 13px;
  background: #111313;
  color: #fff;
  font-family: inherit;
  font-size: 14px;
}

.form-field :deep(.p-inputtext) {
  min-height: 48px;
  padding: 0 13px;
}

.form-field :deep(.p-inputtext:disabled) {
  opacity: 1;
  color: rgb(255 255 255 / 54%);
}

.contact-input {
  position: relative;
}

.contact-input :deep(.p-inputtext) {
  padding-right: 52px;
}

.contact-input__copy {
  position: absolute;
  top: 50%;
  right: 14px;
  color: var(--color-client-blue);
  transform: translateY(-50%);
}

.contact-input__copy :deep(.copy-button) {
  width: 24px;
  height: 28px;
  overflow: hidden;
  font-size: 0;
}

.contact-input__copy :deep(.pi) {
  font-size: 14px;
}

.choice-fieldset {
  padding: 0;
  border: 0;
}

.choice-fieldset legend {
  margin-bottom: 10px;
}

.choice-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
}

.choice-card,
.duration-option {
  display: flex;
  min-height: 52px;
  align-items: center;
  gap: 9px;
  padding: 10px 12px;
  border: 1px solid rgb(255 255 255 / 11%);
  border-radius: 13px;
  background: #111313;
  color: rgb(255 255 255 / 76%);
  font-size: 13px;
}

.choice-card--selected,
.duration-option--selected {
  border-color: rgb(0 148 255 / 68%);
  background: rgb(0 148 255 / 11%);
  color: #fff;
}

.choice-card :deep(.p-radiobutton-checked .p-radiobutton-box),
.duration-option :deep(.p-radiobutton-checked .p-radiobutton-box) {
  border-color: var(--color-client-blue);
  background: var(--color-client-blue);
}

.duration-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
}

.duration-option {
  min-height: 48px;
  justify-content: center;
}

.duration-option--disabled {
  opacity: 0.42;
}

.field-note {
  color: rgb(255 255 255 / 42%);
  font-size: 10px;
  line-height: 1.4;
}

.optional-label {
  color: rgb(255 255 255 / 42%);
  font-weight: 400;
}

.form-field :deep(.p-textarea) {
  min-height: 102px;
  padding: 12px;
  resize: vertical;
}

.form-field :deep(.p-textarea::placeholder) {
  color: rgb(255 255 255 / 35%);
}

.submit-button {
  min-height: 54px;
  justify-content: center;
  margin-top: 2px;
  border: 0;
  border-radius: 999px;
  background: var(--color-client-blue);
  color: #fff;
  font-weight: 650;
}

@media (min-width: 600px) {
  .booking-dialog {
    max-height: min(900px, calc(100svh - 36px));
    border: 1px solid rgb(255 255 255 / 10%);
    border-radius: 24px;
  }
}
</style>
