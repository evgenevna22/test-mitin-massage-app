import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';

import AdminLayout from '@/layouts/AdminLayout.vue';
import ClientLayout from '@/layouts/ClientLayout.vue';
import { useRoleStore } from '@/stores/role.ts';
import { useRole, useSlots } from '@composables';
import { useSlotsStore } from '@stores/slots';
import EmptyLayout from '@/layouts/EmptyLayout.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: EmptyLayout,
    name: 'Home',
  },

  {
    path: '/client',
    component: ClientLayout,
    name: 'Client',
    meta: {
      breadcrumb: {
        label: 'ClientHome',
        icon: 'pi pi-home',
      },
    },
    children: [
      {
        path: '',
        name: 'ClientHome',
        component: () => import('../views/client/ClientHome.vue'),
      },
      {
        path: 'calendar/:masterId',
        component: () => import('../views/client/calendar/Calendar.vue'),
        name: 'Calendar',
        meta: {
          breadcrumb: {
            label: 'Calendar',
            icon: 'pi pi-calendar',
          },
        },
      },
      {
        path: 'slots/:masterId/:day',
        component: () => import('../views/client/slots/Slots.vue'),
        beforeEnter: (current, _, next) => {
          const slotsStore = useSlotsStore();
          const { getSlotsByDay } = useSlots();

          if (
            typeof current.params.masterId === 'string' &&
            current.params.masterId !== slotsStore.selectedMasterId
          ) {
            slotsStore.selectMaster(current.params.masterId);
          }

          if (
            typeof current.params.day === 'string' &&
            current.params.day !== slotsStore.selectedDate
          ) {
            slotsStore.selectDate(current.params.day);
            void getSlotsByDay();
          }

          next();
        },
      },
    ],
  },

  {
    path: '/master',
    component: AdminLayout,
    name: 'Master',
    meta: {
      requiresAuth: true,
      breadcrumb: {
        label: 'MasterHome',
        icon: 'pi pi-home',
      },
    },
    children: [
      {
        path: '',
        name: 'MasterHome',
        component: () => import('../views/master/MasterHome.vue'),
      },
      {
        path: 'slot-builder',
        name: 'MasterSlotBuilder',
        component: () => import('../views/master/slot-builder/MasterSlotBuilder.vue'),
        meta: {
          breadcrumb: {
            label: 'Calendar',
            icon: 'pi pi-calendar',
          },
        },
      },
      {
        path: 'upcoming-slots',
        name: 'MasterUpcomingSlots',
        component: () =>
          import('../views/master/upcoming-slots/MasterUpcomingSlots.vue'),
        meta: {
          breadcrumb: {
            label: 'Calendar',
            icon: 'pi pi-check',
          },
        },
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  const roleStore = useRoleStore();
  const { getAppRole } = useRole();

  if (!roleStore.role) {
    await getAppRole();
  }

  const isMasterRoute = Boolean(to.meta.requiresAuth);
  const isMasterRole = roleStore.role === 'master';
  const isFirstNavigation = from.matched.length === 0;

  if (to.path === '/') {
    return { path: `/${roleStore.role}` };
  }

  if (isMasterRoute && !isMasterRole) {
    return { path: '/client' };
  }

  if (isFirstNavigation && isMasterRole && !isMasterRoute) {
    return { path: '/master' };
  }
});
