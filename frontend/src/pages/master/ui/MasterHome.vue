<template>
  <header>
    <p>welcome to the mitin massage, mitya</p>
    <RoleSwitcher />
  </header>

  <div class="main">
    <div class="card">
      <Tabs value="month">
        <TabList>
          <Tab value="month">Month</Tab>
          <Tab value="list">List</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="month">
            <MasterMonthOverview
              v-if="view === 'overview'"
              @create-work-days="view = 'work-days'"
            />
            <MasterWorkDays
              v-else
              @cancel="view = 'overview'"
              @completed="view = 'overview'"
            />
          </TabPanel>
          <TabPanel value="list">
            <MasterBookings />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RoleSwitcher } from '@/features/switch-role';
import MasterBookings from './master-bookings/MasterBookings.vue';
import { defineAsyncComponent, ref } from 'vue';

type View = 'overview' | 'work-days';

const MasterMonthOverview = defineAsyncComponent(
  () => import('./master-month-view/scenarios/MasterMonthOverview.vue')
);
const MasterWorkDays = defineAsyncComponent(
  () => import('./master-month-view/scenarios/MasterWorkDays.vue')
);

const view = ref<View>('overview');
</script>

<style lang="scss" scoped>
.main {
  max-width: 500px;
  width: 100%;
  margin: 16px auto;
}
</style>
