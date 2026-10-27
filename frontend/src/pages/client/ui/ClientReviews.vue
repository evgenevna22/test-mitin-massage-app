<template>
  <main class="client-page reviews-page">
    <header class="reviews-header">
      <Button
        class="back-button"
        icon="pi pi-arrow-left"
        aria-label="Back to home"
        text
        @click="handleBackHome"
      />
      <span class="brand-mark">M*</span>
    </header>
    <section class="reviews-content">
      <p class="eyebrow">KIND WORDS</p>
      <h1>Reviews</h1>
      <div class="reviews-empty">
        <i class="pi pi-star-fill" aria-hidden="true" />
        <p>Client stories are coming soon.</p>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const handleBackHome = () => {
  router.push({ name: 'ClientHome' });
};
</script>

<style lang="scss" scoped>
.reviews-page {
  display: flex;
  min-height: 100svh;
  flex-direction: column;
  padding: 18px 20px 28px;
  background:
    radial-gradient(ellipse at 80% 100%, rgb(0 148 255 / 12%), transparent 44%),
    var(--color-client-background);
}

.reviews-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0;
}

.back-button {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  color: #fff;
}

.brand-mark {
  color: var(--color-client-orange);
  font-size: 20px;
  font-weight: 850;
}

.reviews-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 30px;
}

.eyebrow {
  color: var(--color-client-orange);
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.16em;
}

h1 {
  margin-top: 8px;
  color: #fff;
  font-size: clamp(42px, 12vw, 66px);
  font-weight: 600;
  letter-spacing: -0.065em;
}

.reviews-empty {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 30px;
  padding: 18px;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 18px;
  background: #111313;
  color: rgb(255 255 255 / 64%);
  font-size: 14px;
}

.reviews-empty .pi {
  color: var(--color-client-orange);
}
</style>
