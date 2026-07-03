import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Calendar from '../components/Calendar.vue'
import Main from '../components/Main.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Main',
    component: Main,
    meta: {
      label: 'Main',
      icon: 'pi pi-home',
    },
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: Calendar,
    meta: {
      label: 'Calendar',
      icon: 'pi pi-calendar',
    },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
