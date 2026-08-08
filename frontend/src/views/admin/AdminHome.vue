<template>
  <RoleSwitcher view-as="client" />

  <div class="main">
    <p>
      welcome to the mitin massage, mitya <br />
      what's bring you here today?
    </p>

    <Divider />

    <p><b>the most firing slots:</b></p>
    <AdminUpcomingSlots :is-preview="true" />

    <Divider />

    <b>go to:</b>
    <ul class="menu-items">
      <li
        v-for="navItem in navigationItems"
        :key="navItem.label"
        class="menu-item"
      >
        <router-link v-slot="{ href, navigate }" :to="navItem.route" custom>
          <a v-ripple :href="href" @click="navigate" class="text-sm leading-4">
            <span :class="navItem.icon" />
            <span class="ml-2">{{ navItem.label }}</span>
          </a>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import AdminUpcomingSlots from './upcoming-slots/AdminUpcomingSlots.vue'
import { RoleSwitcher } from '@components'

const navigationItems = [
  {
    route: 'admin/upcoming-slots',
    icon: 'pi pi-check',
    label: 'upcoming slots',
  },
  {
    route: 'admin/slot-builder',
    icon: 'pi pi-calendar',
    label: 'create slots',
  },
]
</script>

<style lang="scss">
.main {
  max-width: 500px;
  width: 100%;
  margin: 16px auto;
}

.menu-items {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu-item {
  a {
    color: inherit;
    text-decoration: inherit;
    gap: 4px;
    display: inline-flex;
    align-items: center;
  }

  &:hover {
    color: gray;
  }
}
</style>
