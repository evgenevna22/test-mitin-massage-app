<template>
  <RoleSwitcher view-as="admin" />

  <div class="main">
    <p>welcome to the mitin massage, friend</p>

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
import { RoleSwitcher } from '@components'

const navigationItems = [
  {
    route: '/client/calendar',
    icon: 'pi pi-calendar',
    label: 'calendar',
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
