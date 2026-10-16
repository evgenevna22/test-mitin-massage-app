import type { Role } from '@/types';
import { ROLE_MODE_COOKIE_NAME } from '../consts';

/**
 * Composable is responsible for setting a cookie to recongnise temporal role.
 * Masters can switch between their schedule view and the client experience.
 */
export const useRoleReversal = () => {
  const setCookie = (viewAs: Role['role']) => {
    document.cookie = `${ROLE_MODE_COOKIE_NAME}=${viewAs}; path=/`;
  };

  const deleteRoleCookie = () => {
    document.cookie = `${ROLE_MODE_COOKIE_NAME}=; Max-Age=0; path=/`;
  };

  return {
    setCookie,
    deleteRoleCookie,
  };
};
