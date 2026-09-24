import { RoleApi } from '@/api/role';
import { useRoleStore } from '@/stores/role';
import { handleError } from '@utils';
import { useRoleReversal } from './use-role-reversal';
import { useNotifications } from './use-notifications';

/**
 * Composable for getting and saving the role of the application
 */
export const useRole = () => {
  const notifications = useNotifications();
  const roleStore = useRoleStore();
  const { deleteRoleCookie } = useRoleReversal();

  const getAppRole = async (forcedUpdate = false) => {
    if (roleStore.role && !forcedUpdate) {
      return Promise.resolve();
    }

    try {
      const role = await RoleApi.getRole();

      if (!role) {
        const error = new Error();
        return handleError({ error }, notifications);
      }

      roleStore.setRole(role);
    } catch (error) {
      handleError({ error }, notifications);
    } finally {
      deleteRoleCookie();
    }
  };

  return {
    getAppRole,
  };
};
