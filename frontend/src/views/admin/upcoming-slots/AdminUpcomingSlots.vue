<template>
  <div v-if="slots?.length" class="slots">
    <Card v-for="slot in slots" :key="slot.id">
      <template #content>
        <h4>{{ slot.date }} {{ slot.time }}</h4>
        <p>
          {{ slot.userName }} <br />
          @{{ slot.userNickname }}
        </p>
      </template>
    </Card>
  </div>
  <div v-else>There is no slots for you, hon</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUpcomingSlots } from './use-upcoming-slots'

const props = defineProps<{
  isPreview?: boolean
}>()

const { upcomingSlots } = useUpcomingSlots()

const slots = computed(() =>
  props.isPreview ? upcomingSlots.value.slice(0, 3) : upcomingSlots.value
)
</script>

<style>
.slots {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
