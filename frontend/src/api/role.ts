import type { Role } from '@/types/role'
import api from '.'

export class RoleApi {
  public static getRole = async (): Promise<Role | undefined> => {
    try {
      return (await api.get('/role')).data
    } catch (e) {
      console.error('no role')
    }
  }
}
