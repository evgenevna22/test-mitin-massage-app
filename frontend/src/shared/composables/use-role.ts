import { RoleApi } from '@/api/role'
import { useRoleStore } from '@/stores/role'
import { useToast } from 'primevue'
import { handleError } from '@utils'

/**
 * Composable for getting and saving the role of the application
 */
export const useRole = () => {
  const toast = useToast()
  const roleStore = useRoleStore()

  const getAppRole = async () => {
    if (roleStore.role) {
      return Promise.resolve()
    }

    try {
      const role = await RoleApi.getRole()
      if (!role) {
        throw Error
      }
      roleStore.setRole(role)
    } catch (error) {
      handleError({ error }, toast)
    }
  }

  return {
    getAppRole,
  }
}
