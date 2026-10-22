import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import { fileURLToPath } from 'url';

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [PrimeVueResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared/ui': fileURLToPath(
        new URL('./src/shared/ui', import.meta.url)
      ),
      '@shared/api': fileURLToPath(
        new URL('./src/shared/api', import.meta.url)
      ),
      '@shared/lib': fileURLToPath(new URL('./src/shared/lib', import.meta.url)),
      '@shared/config': fileURLToPath(new URL('./src/shared/config', import.meta.url)),
    },
  },
});
