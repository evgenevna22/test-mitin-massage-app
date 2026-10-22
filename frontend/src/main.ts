import { createApp } from 'vue';
import './style.scss';
import { router } from './app/router';
import PrimeVue from 'primevue/config';
import { createPinia } from 'pinia';
import Aura from '@primeuix/themes/aura';

import App from './App.vue';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

const app = createApp(App);

app.use(createPinia());
app.use(ToastService);
app.use(ConfirmationService);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      components: {
        card: {
          css: {
            bodyPadding: 'var(--gap-2x)',
          },
        },
      },
    },
  },
});
app.use(router);

app.mount('#app');
