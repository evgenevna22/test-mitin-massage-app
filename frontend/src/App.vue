<template>
  <div id="app">
    <Toast />

    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRole } from '@composables'

const { getAppRole } = useRole()

onMounted(getAppRole)
</script>
