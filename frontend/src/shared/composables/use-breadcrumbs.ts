import type { Breadcrumb } from '@/types'
import type { MenuItem } from 'primevue/menuitem'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

/**
 * Composable for breadcrumbs
 */
export const useBreadcrumbs = () => {
  const route = useRoute()

  const generateBreadcrumbs = (): MenuItem[] => {
    const breadcrumbs = []

    for (const matchedRoute of route.matched) {
      if (!matchedRoute?.meta?.breadcrumb) {
        continue
      }

      const { title, icon } = matchedRoute.meta.breadcrumb as Breadcrumb

      breadcrumbs.push({
        url: matchedRoute?.path ?? '',
        label: title ?? '',
        icon: icon ?? '',
        isCurrent: matchedRoute?.name === route.name,
      })
    }

    return breadcrumbs
  }

  const breadcrumbs = computed<MenuItem[]>(generateBreadcrumbs)

  return {
    breadcrumbs,
  }
}
