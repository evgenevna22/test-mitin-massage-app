<template>
  <Card>
    <template #title>
      <router-link to="/" custom v-slot="{ navigate }">
        <Button
          icon="pi pi-arrow-circle-left"
          aria-label="Back"
          rounded
          size="small"
          @click="navigate"
        />
      </router-link>
      {{ $route.params.day }}
    </template>
    <template #content>
      <Spinner v-if="isLoading" />

      <div v-else class="time-slots">
        <Button
          v-for="timeSlot of timeSlots"
          :key="timeSlot.date"
          size="small"
          @click="handleButtonClick(timeSlot.id)"
        >
          {{ timeSlot.time }}
        </Button>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSlotsStore } from '@stores/slots'
import { Spinner } from '@components'
import { useSlot } from './use-slot'
import { useSlots } from '@composables'

const slotsStore = useSlotsStore()
const { selectSlot } = useSlot()
const { getSlots } = useSlots()

const isLoading = computed(() => slotsStore.areCurrentSlotsLoading)

const timeSlots = computed(() => slotsStore.currentSlots)

const handleButtonClick = async (id: string) => {
  await selectSlot(id)
  await getSlots()
}
</script>

<style lang="scss" scoped>
.time-slots {
  display: flex;
  gap: 4px;
  justify-content: center;
}
</style>
