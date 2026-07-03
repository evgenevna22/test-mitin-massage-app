import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import Calendar from '../views/calendar/Calendar.vue'

import { useSlotsStore } from '../stores/slots.ts'
import Slots from '../views/slots/Slots.vue'
import { useSlots } from '../shared/composables/use-slots.ts'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Calendar,
    name: 'Home',
  },
  {
    path: '/slots/:day',
    component: Slots,
    beforeEnter: (current, to, next) => {
      const slotsStore = useSlotsStore()
      const { getSlots } = useSlots()

      console.log('current', current)

      if (!slotsStore.currentDate && typeof current.params?.day === 'string') {
        slotsStore.selectDate(current.params.day)
        void getSlots()
      }

      next()
    },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
