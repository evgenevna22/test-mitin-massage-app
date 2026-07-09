import { defineAsyncComponent } from 'vue'

export const Spinner = defineAsyncComponent(() => import('./Spinner.vue'))
export const Breadcrumbs = defineAsyncComponent(
  () => import('./Breadcrumbs.vue')
)
