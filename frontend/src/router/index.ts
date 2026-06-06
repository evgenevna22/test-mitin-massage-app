import { createRouter, createWebHistory } from 'vue-router'

import Calendar from '../views/Calendar.vue'

import Slots from '../views/Slots.vue'

const routes = [
  {
    path: '/',
    component: Calendar,
  },
  {
    path: '/slots/:date',
    component: Slots,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
