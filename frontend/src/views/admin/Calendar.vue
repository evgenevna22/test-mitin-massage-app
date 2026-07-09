<template>
  <Breadcrumbs />

  <Card>
    <template #title>
      <Button
        v-if="isBackButtonVisible"
        icon="pi pi-arrow-circle-left"
        aria-label="Back"
        rounded
        size="small"
        @click="handleClickBackButton"
      />

      Select {{ stepTitle }}
    </template>
    <template #content>
      <div class="card">
        <DatePicker
          v-show="step === Step.First"
          v-model="dates"
          inline
          class="w-full sm:w-[30rem]"
          selectionMode="multiple"
        />

        <div v-if="step === Step.Second" class="time-block">
          Dates:
          <ul>
            <li v-for="date in dates">{{ date }}</li>
          </ul>
          <label>Start time</label>
          <input type="time" v-model="timeSlot.start" />

          <label>End time</label>
          <input type="time" v-model="timeSlot.end" />

          <label>Gap time</label>
          <input type="time" v-model="timeSlot.gap" />

          <label>Duration time</label>
          <input type="time" v-model="timeSlot.duration" />
        </div>

        <div class="buttons">
          <Button
            :label="saveButtonLabel"
            :loading="isLoading"
            :disabled="isSaveButtonDisabled"
            @click="handleClickButton"
          />

          <Button label="Reset" @click="handleClickResetButton" />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { TimeSlot } from '@/types'
import { useSlots } from './use-slots'
import { Breadcrumbs } from '@components'

const Step = {
  First: 0,
  Second: 1,
}

const getInitialTimeSlotState = (): TimeSlot => ({
  start: '',
  end: '',
  duration: '',
  gap: '',
})

const { createSlot, isLoading } = useSlots()

const step = ref(Step.First)

const dates = ref<Date[]>([])
const timeSlot = reactive(getInitialTimeSlotState())

const isTimeSlotsFilled = computed(() => Object.values(timeSlot).every(Boolean))

const stepTitle = computed(() => (step.value === Step.First ? 'dates' : 'time'))
const saveButtonLabel = computed(() =>
  step.value === Step.First ? 'Continue' : 'Save'
)

const isBackButtonVisible = computed(() => step.value === Step.Second)

const isSaveButtonDisabled = computed(() =>
  step.value === Step.First
    ? !Boolean(dates.value.length)
    : !isTimeSlotsFilled.value
)

const handleClickButton = async () => {
  if (step.value === Step.First) {
    step.value = Step.Second

    return
  }

  if (dates.value.length && isTimeSlotsFilled.value) {
    await createSlot(dates.value, timeSlot)
    resetTimeSlots()
    step.value = Step.First
  }
}

const handleClickResetButton = () => {
  if (step.value === Step.First) {
    dates.value = []
    return
  }
  resetTimeSlots()
}

const handleClickBackButton = () => {
  step.value = Step.First
}

const resetTimeSlots = () => {
  Object.assign(timeSlot, getInitialTimeSlotState())
}
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.buttons {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

ul,
li {
  list-style: none;
}
</style>
