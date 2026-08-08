import { RoleApi } from '@/api/role'
import { useRoleStore } from '@/stores/role'
import { useToast } from 'primevue'
import { handleError } from '@utils'
import { useRoleReversal } from './use-role-reversal'

/**
 * Composable for getting and saving the role of the application
 */
export const useRole = () => {
  const toast = useToast()
  const roleStore = useRoleStore()
  const { deleteCookie } = useRoleReversal()

  const getAppRole = async (forcedUpdate = false) => {
    if (roleStore.role && !forcedUpdate) {
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
    } finally {
      deleteCookie()
    }
  }

  return {
    getAppRole,
  }
}
