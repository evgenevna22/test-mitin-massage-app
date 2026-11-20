<template>
  <header class="hero">
    <h1 class="title">MITIN<br />MASSAGE<span class="title-symbol">*</span></h1>

    <div class="reviews-button" @click="handleReviewsPage">
      <img
        src="./assets/header-button-bg.png"
        alt=""
        class="reviews-button-background"
      />
      <div class="reviews-button-body">
        <img
          width="60"
          height="60"
          src="./assets/mitya_review_img.png"
          alt=""
          class="reviews-page-avatar"
        />
        <span class="reviews-page-text">Reviews</span>
      </div>
    </div>

    <HeroBooking :masters="props.masters" />
    <div class="hero__grain" aria-hidden="true"></div>
  </header>
</template>

<script lang="ts" setup>
import type { MasterDTO } from '../../model';
import HeroBooking from './HeroBooking.vue';

const props = defineProps<{
  masters: MasterDTO[];
}>();

const handleReviewsPage = () => {};
</script>

<style lang="scss" scoped>
.hero {
  position: relative;
  display: flex;
  min-height: 602px;
  flex-direction: column;
  overflow: hidden;
  background: url('./assets/mitya_header_img.jpg');
  background-position: center 38%;
  background-size: cover;
}

.title {
  padding: 60px 0 0 25px;
  font-size: var(--font-size-big-title);
  line-height: 55px;
  font-weight: 800;
  color: var(--color-client-title);
  margin-bottom: 64px;
}

.title-symbol {
  font-size: var(--font-size-symbol);
  transform: translateY(-0.18em);
}

.reviews-button {
  position: relative;
  cursor: pointer;
}

.reviews-button-background {
  width: 100%;
}

.reviews-button-body {
  position: absolute;
  display: flex;
  top: 24%;
  left: 25%;
  align-items: center;
  width: 100%;
}

.hero__booking-button {
  min-height: 58px;
  font-size: 16px;
}

.hero__grain {
  position: absolute;
  right: -35%;
  bottom: -30%;
  width: 140%;
  height: 55%;
  background: url('./assets/slots_top_bg.png') center / cover;
  opacity: 0.22;
  pointer-events: none;
}
</style>
