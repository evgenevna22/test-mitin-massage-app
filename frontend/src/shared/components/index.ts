import { defineAsyncComponent } from 'vue';

export const RoleSwitcher = defineAsyncComponent(
  () => import('./RoleSwitcher.vue')
);

export const SkeletonProgress = defineAsyncComponent(
  () => import('./SkeletonProgress.vue')
);
export const Breadcrumbs = defineAsyncComponent(
  () => import('./Breadcrumbs.vue')
);
export const Review = defineAsyncComponent(() => import('./Review.vue'));
export const SlotForm = defineAsyncComponent(() => import('./SlotForm.vue'));
