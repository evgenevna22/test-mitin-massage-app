import axios from 'axios'

const { VITE_API_URL } = import.meta.env

const api = axios.create({
  baseURL: VITE_API_URL,
})

api.interceptors.request.use(async (config) => {
  const initData = window.Telegram?.WebApp?.initData

  if (initData) {
    config.headers['x-telegram-init-data'] = initData
  }

  const cookieRole = await cookieStore.get('role-mode')

  if (cookieRole?.value) {
    config.headers['role-mode'] = cookieRole.value
  }

  return config
})

export default api
