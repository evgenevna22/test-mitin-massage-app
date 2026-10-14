<template>
  <header>
    <p>welcome to the mitin massage, mitya</p>
    <RoleSwitcher view-as="client" />
  </header>

  <div class="main">
    <AdminSchedule />
  </div>
</template>

<script lang="ts" setup>
import AdminSchedule from './schedule/AdminSchedule.vue';
import { RoleSwitcher } from '@components';
</script>

<style lang="scss">
.main {
  max-width: 500px;
  width: 100%;
  margin: 16px auto;
}
</style>
