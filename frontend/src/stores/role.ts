import type { Role } from '@/types/role'
import { defineStore } from 'pinia'

type State = {
  role: Role | ''
}

export const useRoleStore = defineStore('role-store', {
  state: (): State => ({
    role: '',
  }),
  actions: {
    setRole(role: Role) {
      this.role = role
    },
  },
})
