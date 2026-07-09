import { RoleApi } from '@/api/role'
import { useRoleStore } from '@/stores/role'
import { useToast } from 'primevue'

/**
 * Composable for getting and saving the role of the application
 */
export const useRole = () => {
  const toast = useToast()
  const roleStore = useRoleStore()

  const getAppRole = async () => {
    try {
      const role = await RoleApi.getRole()
      if (!role) {
        throw Error
      }
      roleStore.setRole(role)
    } catch (e) {
      toast.add({ severity: 'error', summary: 'no role' })
    }
  }

  return {
    getAppRole,
  }
}
