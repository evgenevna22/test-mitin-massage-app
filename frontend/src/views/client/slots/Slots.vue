<template>
  <Card>
    <template #title>
      <router-link to="/" custom v-slot="{ navigate }">
        <Button
          icon="pi pi-arrow-circle-left"
          aria-label="Back"
          rounded
          size="small"
          @click="navigate"
        />
      </router-link>
      {{ $route.params.day }}
    </template>
    <template #content>
      <SkeletonProgress v-if="isLoading" />

      <div v-else class="time-slots">
        <Button
          v-for="timeSlot of timeSlots"
          :key="timeSlot.date"
          size="small"
          @click="openBookingForm(timeSlot.id)"
        >
          {{ timeSlot.time }}
        </Button>
      </div>

      <form
        v-if="selectedSlotId"
        class="booking-form"
        @submit.prevent="bookSlot"
      >
        <BookForm
          v-model:massage-type="bookingDetails.massageType"
          v-model:comment="bookingDetails.comment"
        />
        <div class="booking-form__actions">
          <Button
            label="Cancel"
            severity="secondary"
            @click="resetBookingForm"
          />
          <Button
            type="submit"
            label="Book"
            :disabled="!bookingDetails.massageType.trim()"
          />
        </div>
      </form>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useSlotsStore } from '@stores/slots';
import { useSlot } from './use-slot';
import { SkeletonProgress } from '@components';
import { useSlots } from '@composables';
import { useRouter } from 'vue-router';
import BookForm from '../BookForm.vue';

const router = useRouter();

const slotsStore = useSlotsStore();
const { selectSlot } = useSlot();
const { getSlotsByDay } = useSlots();

const isLoading = computed(() => slotsStore.areCurrentSlotsLoading);

const timeSlots = computed(() => slotsStore.currentSlots);
const selectedSlotId = ref<string | null>(null);
const bookingDetails = reactive({
  massageType: '',
  comment: '',
});

const openBookingForm = (id: string) => {
  selectedSlotId.value = id;
};

const resetBookingForm = () => {
  selectedSlotId.value = null;
  bookingDetails.massageType = '';
  bookingDetails.comment = '';
};

const bookSlot = async () => {
  if (!selectedSlotId.value || !bookingDetails.massageType.trim()) {
    return;
  }

  const isBooked = await selectSlot(selectedSlotId.value, {
    massageType: bookingDetails.massageType.trim(),
    ...(bookingDetails.comment.trim() && {
      comment: bookingDetails.comment.trim(),
    }),

    
  });
  console.log('isBooked', isBooked);

  // if (!isBooked) {
  //   return;
  // }

  await getSlotsByDay();
  resetBookingForm();
  router.push({ path: '/client' });
};
</script>

<style lang="scss" scoped>
.time-slots {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.booking-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.booking-form__actions {
  display: flex;
  gap: 8px;
  justify-content: end;
}
</style>
