import { createApp } from 'vue'
import './style.scss'
import { router } from './router'
import { definePreset } from '@primeuix/themes'
import PrimeVue from 'primevue/config'
import { createPinia } from 'pinia'
import Aura from '@primeuix/themes/aura'

import App from './App.vue'
import ToastService from 'primevue/toastservice'

const app = createApp(App)

const ThemePreset = definePreset(Aura, {
  // semantic: {
  //   disabled: {
  //     opacity: '1',
  //   },
  // },
  // components: {
  //   datepicker: {
  //     date: {
  //       selectedBackground: 'transparent',
  //       selectedColor: 'var(--p-datepicker-date-color)',
  //       hoverBackground: 'transparent',
  //       focusRing: undefined,
  //     },
  //   },
  // },
})

app.use(createPinia())
app.use(router)
app.use(ToastService)
app.use(PrimeVue, {
  theme: {
    preset: ThemePreset,
  },
})

app.mount('#app')
