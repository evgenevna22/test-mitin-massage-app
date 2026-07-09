<template>
  <div>upcomingSlots: {{ upcomingSlots }}</div>
  <div>isLoading: {{ isLoading }}</div>
</template>

<script setup lang="ts">
import { useUpcomingSlots } from './use-upcoming-slots'

const { upcomingSlots, isLoading } = useUpcomingSlots()
</script>

<style></style>
