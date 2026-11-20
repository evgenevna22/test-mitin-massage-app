<template>
  <div class="fire-booking">
    <button
      class="fire-booking-button"
      type="button"
      @click="handleStartBooking"
    >
      Book a session
    </button>

    <div v-if="nextAvailableSlotsByDate.length" class="fire-booking-list">
      <div
        v-for="group in nextAvailableSlotsByDate"
        :key="group.date"
        class="fire-booking-item"
      >
        <span>{{ group.dateLabel }}</span>
        <div class="fire-booking-slots">
          <button
            v-for="slot in group.slots"
            :key="slot.id"
            type="button"
            :aria-label="`Book ${group.dateLabel} at ${slot.time}`"
            @click="handleChooseSlot(slot)"
          >
            {{ slot.time }}
          </button>
        </div>
      </div>
    </div>
    <p v-else-if="isLoadingNextAvailableSlots" class="fire-booking-status">
      Finding available sessions…
    </p>
    <p v-else class="fire-booking-status">No nearby sessions are available.</p>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ClientSlotsApi } from '../../api/client-slots';
import type { ClientSlotDTO, MasterDTO } from '../../model';
import { useSlotsStore } from '../../model/slots-store';
import { useBookingFormStorage } from '../../model/use-booking-form-storage';

const props = defineProps<{
  masters: MasterDTO[];
}>();

const router = useRouter();
const slotsStore = useSlotsStore();
const { clearBookingForm, updateBookingForm } = useBookingFormStorage();
const nextAvailableSlots = ref<ClientSlotDTO[]>([]);
const isLoadingNextAvailableSlots = ref(true);

const nextAvailableSlotsByDate = computed(() => {
  const slotsByDate = new Map<string, ClientSlotDTO[]>();

  nextAvailableSlots.value.forEach((slot) => {
    const dateSlots = slotsByDate.get(slot.date) ?? [];
    dateSlots.push(slot);
    slotsByDate.set(slot.date, dateSlots);
  });

  return Array.from(slotsByDate, ([date, slots]) => ({
    date,
    dateLabel: new Intl.DateTimeFormat('en', {
      weekday: 'short',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(`${date}T12:00:00`)),
    slots,
  }));
});

const selectDefaultMaster = () => {
  const firstMaster = props.masters[0];

  if (firstMaster) {
    slotsStore.selectMaster(firstMaster.id);
  }
};

const handleStartBooking = async () => {
  selectDefaultMaster();
  clearBookingForm();
  await router.push({ name: 'ClientBookingMassageType' });
};

const handleChooseSlot = async (slot: ClientSlotDTO) => {
  selectDefaultMaster();
  clearBookingForm();
  updateBookingForm({
    slotId: slot.id,
    date: slot.date,
    time: slot.time,
  });

  await router.push({ name: 'ClientBookingMassageType' });
};

onMounted(async () => {
  try {
    nextAvailableSlots.value = await ClientSlotsApi.getNextAvailableSlots();
  } catch (error) {
    console.error(error);
  } finally {
    isLoadingNextAvailableSlots.value = false;
  }
});
</script>

<style lang="scss" scoped>
.fire-booking {
  display: flex;
  width: 100%;
  min-height: 400px;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding: 30px 0;
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

.fire-booking-slots {
  display: flex;
  gap: 8px;
}

.fire-booking-slots button {
  padding: 8px 12px;
  border: 0;
  border-radius: 999px;
  background: rgb(255 255 255 / 10%);
  color: #fff;
}

.fire-booking-status {
  color: rgb(255 255 255 / 70%);
  font-size: 13px;
}

.fire-booking-button {
  margin-top: auto;
  padding: 25px 50px;
  border: 0;
  border-radius: 100px;
  background: var(--color-client-primary-button);
  color: var(--white);
  font-size: var(--font-size-button);
}
</style>
