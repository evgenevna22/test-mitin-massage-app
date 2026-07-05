import type { MenuItem } from 'primevue/menuitem'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export const useBreadcrumbs = () => {
  const route = useRoute()
  const router = useRouter()

  const generateBreadcrumbs = (): MenuItem[] => {
    const paths = ['/', ...route.fullPath.split('/').filter(Boolean)]

    const matchedRoutes = paths.map((path) => router.resolve(path))

    return matchedRoutes.map((matchedRoute) => ({
      url: matchedRoute.path ?? '',
      label: (matchedRoute.meta?.title as string) ?? '',
      icon: (matchedRoute.meta?.icon as string) ?? '',
      isCurrent: matchedRoute.name === route.name,
    }))
  }

  const breadcrumbs = computed<MenuItem[]>(generateBreadcrumbs)

  return {
    breadcrumbs,
  }
}
