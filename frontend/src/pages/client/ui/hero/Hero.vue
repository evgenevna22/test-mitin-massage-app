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

    <div class="fire-booking">
      <button class="fire-booking-button" icon="pi pi-arrow-up-right">
        Book a session
      </button>

      <div class="fire-booking-list">
        <div class="fire-booking-item">
          <span>Today<br />10/20</span>
          <div class="fire-booking-slots">
            <button>15:00</button>
            <button>17:30</button>
          </div>
        </div>
        <div class="fire-booking-item">
          <span>Today<br />10/20</span>
          <div class="fire-booking-slots">
            <button>15:00</button>
            <button>17:30</button>
          </div>
        </div>
      </div>
    </div>
    <div class="hero__grain" aria-hidden="true"></div>
  </header>
</template>

<script lang="ts" setup>
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

.fire-booking {
  width: 100%;
  display: flex;
  padding: 30px 0;
  min-height: 400px;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  border-radius: 35px 35px 0 0;
  background:
    url('./assets/slots_top_bg.png') top / contain,
    linear-gradient(
      to bottom,
      var(--color-client-background) 50%,
      var(--color-client-title) 50%
    );
}

.fire-booking-list {
  display: flex;
  justify-content: center;
  gap: var(--gap-3x);
}

.fire-booking-item {
  min-height: 150px;
  padding: var(--gap-2x);
  border-radius: 25px;
  background: var(--color-client-slot);
}

.fire-booking-button {
  margin-top: auto;
  font-size: var(--font-size-button);
  padding: 25px 50px;
  color: var(--white);
  border: 0;
  border-radius: 100px;
  background: var(--color-client-primary-button);
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
