import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import Calendar from '../views/calendar/Calendar.vue'

import Slot from '../views/slot/Slot.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Calendar,
  },
  {
    path: '/slots/:day',
    component: Slot,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
