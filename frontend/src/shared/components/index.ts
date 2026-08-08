import { defineAsyncComponent } from 'vue'

export { default as RoleSwitcher } from './RoleSwitcher.vue'

export const Spinner = defineAsyncComponent(() => import('./Spinner.vue'))
export const Breadcrumbs = defineAsyncComponent(
  () => import('./Breadcrumbs.vue')
)
