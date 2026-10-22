import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';

import { useUserStore } from '../../entities/user/model/user-store';

const routes: RouteRecordRaw[] = [
  {
    path: '/client',
    component: () => import('../../pages/client/ui/ClientHome.vue'),
    name: 'ClientHome',
    meta: {
      breadcrumb: {
        label: 'ClientHome',
        icon: 'pi pi-home',
      },
    },
    children: [
      {
        path: 'calendar/:masterId',
        component: () => import('../../pages/client/ui/calendar/Calendar.vue'),
        name: 'Calendar',
        meta: {
          breadcrumb: {
            label: 'Calendar',
            icon: 'pi pi-calendar',
          },
        },
      },
    ],
  },

  {
    path: '/master',
    component: () => import('../../pages/master/ui/MasterHome.vue'),
    name: 'MasterHome',
    meta: {
      requiresAuth: true,
      breadcrumb: {
        label: 'MasterHome',
        icon: 'pi pi-home',
      },
    },
    children: [
      {
        path: 'slot-builder',
        name: 'MasterSlotBuilder',
        component: () =>
          import('../../pages/master/ui/master-month-view/master-slot-builder/MasterSlotBuilder.vue'),
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
          import('../../pages/master/ui/master-bookings/MasterBookings.vue'),
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
  const roleStore = useUserStore();

  if (!roleStore.userRole) {
    try {
      await roleStore.loadUserRole();
    } catch {
      // The guard has no component injection context for PrimeVue Toast.
      // Cancel navigation cleanly; the caller can retry once the API is available.
      return false;
    }
  }

  const isMasterRoute = Boolean(to.meta.requiresAuth);
  const isMasterRole = roleStore.userRole === 'master';
  const isFirstNavigation = from.matched.length === 0;

  if (isMasterRoute && !isMasterRole) {
    return { path: '/client' };
  }

  if (isFirstNavigation && isMasterRole && !isMasterRoute) {
    return { path: '/master' };
  }
});
