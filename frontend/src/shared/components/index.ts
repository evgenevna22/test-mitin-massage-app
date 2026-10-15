import { defineAsyncComponent } from 'vue';

export { default as RoleSwitcher } from './RoleSwitcher.vue';

export const SkeletonProgress = defineAsyncComponent(() => import('./SkeletonProgress.vue'));
export const Breadcrumbs = defineAsyncComponent(
  () => import('./Breadcrumbs.vue')
);
export const Review = defineAsyncComponent(() => import('./Review.vue'));
