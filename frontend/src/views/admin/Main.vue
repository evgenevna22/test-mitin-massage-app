<template>
  <div class="main">
    <h3>
      welcome to the mitin massage, mitya <br /><br />
      what's bring you here today?
    </h3>

    <!-- {{ upcomingSlots }}  todo: display only today's slots -->

    <Timeline :value="navigationItems">
      <template #content="slotProps">
        <router-link
          v-slot="{ href, navigate }"
          :to="slotProps.item.route"
          custom
        >
          <a
            v-ripple
            :href="href"
            @click="navigate"
            class="menu-item text-sm leading-4"
          >
            <span :class="slotProps.item.icon" />
            <span class="ml-2">{{ slotProps.item.label }}</span>
          </a>
        </router-link>
      </template>
    </Timeline>
  </div>
</template>

<script lang="ts" setup>
import { useUpcomingSlots } from './upcoming-slots/use-upcoming-slots.ts'

// const today = new Date()

const { upcomingSlots } = useUpcomingSlots()

// const firingSlots = computed(() => upcomingSlots.value.filter(slot => slot.date))

const navigationItems = [
  {
    route: 'upcoming',
    icon: 'pi pi-check',
    label: 'upcoming slots',
  },
  {
    route: 'calendar',
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
