<template>
  <div class="main">
    <h3>
      welcome to the mitin massage, mitya <br /><br />
      what's bring you here today?
    </h3>

    <UpcomingSlots />

    <Menu :model="navigationItems" class="menu">
      <template #item="{ item, props }">
        <router-link v-slot="{ href, navigate }" :to="item.route" custom>
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
          </a>
        </router-link>
      </template>
    </Menu>
  </div>
</template>

<script lang="ts" setup>
import UpcomingSlots from './upcoming-slots/UpcomingSlots.vue'

const navigationItems = [
  {
    route: '/calendar',
    icon: 'pi pi-calendar',
    label: 'Calendar',
  },
]
</script>

<style lang="scss">
.main {
  max-width: 500px;
  width: 100%;
  margin: 16px auto;
}

.menu {
  width: 100%;
}
</style>
