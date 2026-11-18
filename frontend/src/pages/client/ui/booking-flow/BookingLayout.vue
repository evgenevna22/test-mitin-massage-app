<template>
  <div class="booking-layout">
    <header class="booking-layout__header">
      <Button
        class="booking-layout__close"
        icon="pi pi-times"
        aria-label="Close booking"
        rounded
        text
        @click="handleCloseBooking"
      />
    </header>

    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useBookingFormStorage } from '../../model/use-booking-form-storage';

const router = useRouter();
const { clearBookingForm } = useBookingFormStorage();

const handleCloseBooking = async () => {
  clearBookingForm();
  await router.replace({ name: 'ClientHome' });
};
</script>

<style lang="scss" scoped>
.booking-layout {
  min-height: 100svh;
}

.booking-layout__header {
  display: flex;
  justify-content: flex-end;
  padding: 12px 16px 0;
}

.booking-layout__close {
  color: #fff;
}
</style>
