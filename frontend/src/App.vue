<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useSlotsStore } from './stores/slots'

const now = new Date()
const getMonth = () => {
  const month = (now.getMonth() + 1).toString()

  return month.length >= 1 ? `0${month}` : month
}
const slotsStore = useSlotsStore()

onMounted(() => {
  slotsStore.loadSlots(getMonth())
})
</script>
