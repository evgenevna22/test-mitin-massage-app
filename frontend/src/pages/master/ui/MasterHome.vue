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
            <MasterMonthView />
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
import { defineAsyncComponent } from 'vue';

const MasterMonthView = defineAsyncComponent(
  () => import('./master-month-view/MasterMonthView.vue')
);
</script>

<style lang="scss" scoped>
.main {
  max-width: 500px;
  width: 100%;
  margin: 16px auto;
}
</style>
