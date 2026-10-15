<template>
  <Skeleton class="skeleton" :width="width" :height="height" />
</template>

<script lang="ts" setup>
defineProps<{
  width?: string;
  height?: string;
}>();
</script>
