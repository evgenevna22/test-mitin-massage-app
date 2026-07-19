<template>
  <!-- todo: stopped here, need to display all slots grouped by date
   should display in ASC the most closest time, id, name, probably somehow button "remind client" OR "write client" -->
  <Badge
    v-for="slot in upcomingSlots"
    v-bind:key="slot.id"
    :value="slot.date"
    severity="secondary"
  />
</template>

<script setup lang="ts">
import { useUpcomingSlots } from './use-upcoming-slots'

const { upcomingSlots } = useUpcomingSlots()
</script>

<style></style>
