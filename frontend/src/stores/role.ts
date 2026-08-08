import type { Role } from '@/types/role'
import { defineStore } from 'pinia'

type State = {
  role: Role['role'] | ''
  canSwitchRole: boolean
}

export const useRoleStore = defineStore('role-store', {
  state: (): State => ({
    role: '',
    canSwitchRole: false,
  }),
  actions: {
    setRole({ role, canSwitchRole }: Role) {
      this.role = role
      this.canSwitchRole = canSwitchRole
    },
  },
})
