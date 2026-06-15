import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import MainPage from '../components/MainPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '',
    component: MainPage,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
