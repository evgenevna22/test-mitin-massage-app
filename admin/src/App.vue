<template>
  <div id="app">
    <Toast />

    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

console.log(route)
console.log(router)
</script>
