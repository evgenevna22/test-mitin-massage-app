import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    // Разрешаем ngrok-хост чтобы Vite отвечал на запросы через туннель
    allowedHosts: ['ruby-daughter-antirust.ngrok-free.dev'],
    headers: {
      'ngrok-skip-browser-warning': 'true',
      'user-agent': 'cussstom'
    }
  },
})
