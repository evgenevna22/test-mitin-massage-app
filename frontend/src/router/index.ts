import {
  createRouter,
  createWebHistory,
  useRouter,
  type RouteRecordRaw,
} from 'vue-router'

import AdminLayout from '@/layouts/AdminLayout.vue'
import ClientLayout from '@/layouts/ClientLayout.vue'
import { useSlots } from '@composables'
import { useSlotsStore } from '@stores/slots'
import { useRoleStore } from '@/stores/role.ts'

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
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Main',
        component: () => import('../views/admin/Main.vue'),
        meta: {
          label: 'Main',
          icon: 'pi pi-home',
        },
      },
      {
        path: 'calendar',
        name: 'Calendar',
        component: () => import('../views/admin/Calendar.vue'),
        meta: {
          label: 'Calendar',
          icon: 'pi pi-calendar',
        },
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _, next) => {
  const roleStore = useRoleStore()

  if (!to.meta.requiresAuth) {
    next()
    return
  }

  if (to.meta.requiresAuth && roleStore.role === 'admin') {
    next()
  } else {
    next({ path: '/' })
  }
})
