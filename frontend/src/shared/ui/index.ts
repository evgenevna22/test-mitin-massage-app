import { defineAsyncComponent } from 'vue';

export const SkeletonProgress = defineAsyncComponent(
  () => import('./SkeletonProgress.vue')
);
export const Breadcrumbs = defineAsyncComponent(
  () => import('./breadcrumbs/Breadcrumbs.vue')
);
export const Review = defineAsyncComponent(() => import('./Review.vue'));
