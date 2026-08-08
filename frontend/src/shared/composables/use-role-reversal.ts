import type { Role } from '@/types'
import { ROLE_MODE_COOKIE_NAME } from '../consts'

/**
 * Composable is responsible for set cookie to recongnise temporal role*.
 * Temporal role means the situation when the admin/master'd like to see the app through client's eyes.
 */
export const useRoleReversal = () => {
  const setCookie = (viewAs: Role['role']) => {
    document.cookie = `${ROLE_MODE_COOKIE_NAME}=${viewAs}; path=/`
  }

  const deleteCookie = () => {
    document.cookie = `${ROLE_MODE_COOKIE_NAME}=; Max-Age=0; path=/`
  }

  return {
    setCookie,
    deleteCookie,
  }
}
