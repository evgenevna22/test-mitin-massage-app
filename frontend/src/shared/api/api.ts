import { ROLE_MODE_COOKIE_NAME } from '@/shared/config';
import { getCookie } from '@/shared/lib';
import axios from 'axios';

const { VITE_BACKEND_URL } = import.meta.env;

export const api = axios.create({
  baseURL: VITE_BACKEND_URL,
});

api.interceptors.request.use((config) => {
  const initData = window.Telegram?.WebApp?.initData;

  if (initData) {
    config.headers['x-telegram-init-data'] = initData;
  }

  const cookieRole = getCookie(ROLE_MODE_COOKIE_NAME);

  if (cookieRole) {
    config.headers['role-mode'] = cookieRole;
  }

  return config;
});
