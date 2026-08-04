import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import AdminLayout from '@/layouts/AdminLayout.vue'
import ClientLayout from '@/layouts/ClientLayout.vue'
import { useRoleStore } from '@/stores/role.ts'
import { useRole, useSlots } from '@composables'
import { useSlotsStore } from '@stores/slots'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: ClientLayout,
    name: 'Client',
    children: [
      {
        path: '',
        component: () => import('../views/client/calendar/Calendar.vue'), // there should be a MainPage not Calendar
        name: 'Home',
      },
      {
        path: 'slots/:day',
        component: () => import('../views/client/slots/Slots.vue'),
        beforeEnter: (current, _, next) => {
          const slotsStore = useSlotsStore()
          const { getSlots } = useSlots()

          if (
            !slotsStore.currentDate &&
            typeof current.params?.day === 'string'
          ) {
            slotsStore.selectDate(current.params.day)
            void getSlots()
          }

          next()
        },
      },
    ],
  },

  {
    path: '/admin',
    component: AdminLayout,
    name: 'Admin',
    meta: {
      requiresAuth: true,
      breadcrumb: {
        label: 'AdminHome',
        icon: 'pi pi-home',
      },
    },
    children: [
      {
        path: '',
        name: 'AdminHome',
        component: () => import('../views/admin/AdminHome.vue'),
      },
      {
        path: 'slot-builder',
        name: 'AdminSlotBuilder',
        component: () => import('../views/admin/AdminSlotBuilder.vue'),
        meta: {
          breadcrumb: {
            label: 'Calendar',
            icon: 'pi pi-calendar',
          },
        },
      },
      {
        path: 'upcoming-slots',
        name: 'AdminUpcomingSlots',
        component: () =>
          import('../views/admin/upcoming-slots/AdminUpcomingSlots.vue'),
        meta: {
          breadcrumb: {
            label: 'Calendar',
            icon: 'pi pi-check',
          },
        },
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from) => {
  const roleStore = useRoleStore()
  const { getAppRole } = useRole()

  if (!roleStore.role) {
    await getAppRole()
  }

  const isAdminRoute = Boolean(to.meta.requiresAuth)
  const isAdminRole = roleStore.role === 'admin'
  const isFirstNavigation = from.matched.length === 0

  if (isAdminRoute && !isAdminRole) {
    return { path: '/' }
  }

  if (isFirstNavigation && isAdminRole && !isAdminRoute) {
    return { path: '/admin' }
  }
})
