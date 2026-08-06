<template>
  <div class="main">
    <h3>
      welcome to the mitin massage, mitya <br /><br />
      what's bring you here today?
    </h3>

    Your the most firing slots:
    <ul>
      <li v-for="slot in firingSlots" :key="slot.id">
        - date: {{ slot.date }}<br />
        - time: {{ slot.time }}<br />
        - username: {{ slot.userNickname }}
      </li>
    </ul>

    Menu:
    <ul>
      <li v-for="navItem in navigationItems" :key="navItem.label">
        <router-link v-slot="{ href, navigate }" :to="navItem.route" custom>
          <a
            v-ripple
            :href="href"
            @click="navigate"
            class="menu-item text-sm leading-4"
          >
            <span :class="navItem.icon" />
            <span class="ml-2">{{ navItem.label }}</span>
          </a>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useUpcomingSlots } from './upcoming-slots/use-upcoming-slots.ts'

const { upcomingSlots } = useUpcomingSlots()

const firingSlots = computed(() => upcomingSlots.value.slice(0, 4))

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
  {
    route: '',
    icon: 'pi',
    label: '404',
  },
]
</script>

<style lang="scss">
.main {
  max-width: 500px;
  width: 100%;
  margin: 16px auto;
}

.menu-item {
  color: inherit;
  text-decoration: inherit;
  gap: 4px;
  display: inline-flex;
  align-items: center;

  &:hover {
    color: gray;
  }
}
</style>
