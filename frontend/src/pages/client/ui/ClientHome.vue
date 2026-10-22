<template>
  <header>
    <Hero />
  </header>
  <main>
    <h3>Choose a master</h3>
    <p v-if="isLoading">Loading masters…</p>
    <p v-else-if="!masters.length">No masters are available.</p>
    <div v-else class="master-list">
      <Button
        v-for="master in masters"
        :key="master.id"
        :label="master.name"
        @click="chooseMaster(master.id)"
      />
    </div>
  </main>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ClientSlotsApi } from '../api/client-slots';
import type { MasterDTO } from '@/shared/model/index';
import Hero from './hero/Hero.vue';

const router = useRouter();
const masters = ref<MasterDTO[]>([]);
const isLoading = ref(true);

const chooseMaster = (masterId: string) => {
  router.push(`/client/calendar/${encodeURIComponent(masterId)}`);
};

onMounted(async () => {
  try {
    masters.value = await ClientSlotsApi.getMasters();
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style lang="scss" scoped>
.master-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
