<template>
  <Toast />

  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoleReversal } from '@composables'

const { deleteCookie } = useRoleReversal()

onMounted(async () => {
  await deleteCookie()
})
</script>
