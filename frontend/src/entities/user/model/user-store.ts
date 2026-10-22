import { api } from '@/shared/api';
import type { Role } from './role';
import { defineStore } from 'pinia';

type State = {
  userRole: Role['role'] | '';
  canSwitchRole: boolean;
};

export const useUserStore = defineStore('user-store', {
  state: (): State => ({
    userRole: '',
    canSwitchRole: false,
  }),
  actions: {
    setUserRole({ role, canSwitchRole }: Role) {
      this.userRole = role;
      this.canSwitchRole = canSwitchRole;
    },

    async loadUserRole(forcedUpdate = false): Promise<void> {
      if (this.userRole && !forcedUpdate) {
        return Promise.resolve();
      }
      const response = await api.get('/role');
      this.setUserRole(response.data);
    },
  },
});
