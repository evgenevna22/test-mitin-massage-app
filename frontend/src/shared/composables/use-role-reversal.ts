import type { Role } from '@/types'

/**
 * Composable is responsible for set cookie to recongnise temporal role*.
 * Temporal role means the situation when the admin/master'd like to see the app throw client's eyes.
 */
export const useRoleReversal = () => {
  const setCookie = async (viewAs: Role['role']) => {
    await cookieStore.set('role-mode', viewAs)
  }

  const deleteCookie = async () => {
    const isCookieExist = await cookieStore.get('role-mode')

    if (isCookieExist) {
      await cookieStore.delete('role-mode')
    }
  }

  return {
    setCookie,
    deleteCookie,
  }
}
