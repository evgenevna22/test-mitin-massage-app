import { useUserStore } from '@/entities/user/model/user-store';
import { useNotifications } from '@/shared/api';
import { ROLE_MODE_COOKIE_NAME } from '@/shared/config';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

export const useSwitchRole = () => {
  const userStore = useUserStore();
  const notifications = useNotifications();
  const router = useRouter();
  const isSwitching = ref(false);

  const switchToClient = async () => {
    if (isSwitching.value) return;

    isSwitching.value = true;
    document.cookie = `${ROLE_MODE_COOKIE_NAME}=client; path=/`;

    let succeeded = false;

    try {
      await userStore.loadUserRole(true);
      succeeded = true;
    } catch {
      notifications.add({
        severity: 'error',
        summary: 'Could not switch to the client view.',
      });
    } finally {
      document.cookie = `${ROLE_MODE_COOKIE_NAME}=; Max-Age=0; path=/`;
      isSwitching.value = false;
    }

    if (succeeded) {
      await router.replace('/client');
    }
  };

  return { isSwitching, switchToClient };
};
