<template>
  <div class="review">
    <Avatar
      image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
      size="large"
      shape="circle"
    />
    <div class="info">
      <span>{{ review.name }}</span>
      <div class="stars">
        <span v-for="star in review.stars" :key="star">⭐️</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Review } from '@/types';

defineProps<{ review: Review }>();
</script>

<style scoped>
.review {
  display: flex;
  gap: var(--gap-2x);
}
</style>
