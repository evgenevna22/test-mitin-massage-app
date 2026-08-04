<template>
  <!-- todo: stopped here, need to display all slots grouped by date
   should display in ASC the most closest time, id, name, probably somehow button "remind client" OR "write client" -->
  <div class="slots">
    <Badge
      v-for="slot in upcomingSlots"
      v-bind:key="slot.id"
      :value="slot.date"
      severity="secondary"
    />
  </div>
</template>

<script setup lang="ts">
import { useUpcomingSlots } from './use-upcoming-slots'

const { upcomingSlots } = useUpcomingSlots()
</script>

<style>
.slots {
  display: flex;
  gap: 12px;
  justify-content: center;
}
</style>
