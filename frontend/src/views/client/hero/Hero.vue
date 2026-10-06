<template>
  <section class="hero">
    <h1 class="hero-title">
      Hi there, it's <br>
      <span class="accent-name">Mitin massage</span>
    </h1>
    <img class="image" src="/images/hero.jpg" alt="" width="150" height="300" />
    <div class="reviews">
      <Carousel :value="reviews" :num-visible="1" :show-indicators="false">
        <template #item="review">
          <Review class="review" :review="review.data" />
        </template>
      </Carousel>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { Review } from '@components';
import { ref } from 'vue';

const reviews = ref([
  {
    name: 'not a child',
    stars: 5,
  },
  {
    name: 'child',
    stars: 5,
  },
]);
</script>
<style lang="scss" scoped>
.hero {
  position: relative;
}

.hero-title {
  position: absolute;
  margin: var(--gap-2x);
  color: var(--hero-title);
}

.accent-name {
  font-weight: 700;
  color: var(--yellow);
}

.image {
  width: 100%;
  object-fit: cover;
}

.reviews {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  max-width: 250px;
  padding: var(--gap-2x) var(--gap);
  transform: translate(-50%, -50%);
  background: var(--white);
  border-radius: 20px;
}
</style>
