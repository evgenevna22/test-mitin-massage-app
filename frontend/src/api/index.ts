import axios from 'axios'

const { VITE_API_URL } = import.meta.env

const api = axios.create({
  baseURL: VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const initData = window.Telegram?.WebApp?.initData

  if (initData) {
    config.headers['x-telegram-init-data'] = initData
  }

  return config
})

export default api
