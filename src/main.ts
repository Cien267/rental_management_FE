import '@/assets/css/style.css'
import 'primeicons/primeicons.css'
import 'vue-toastification/dist/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import Toast, { POSITION } from 'vue-toastification'
import clickOutsideDirective from '@/directives/click-outside'
import { definePreset } from '@primeuix/themes'
import ConfirmationService from 'primevue/confirmationservice'

const app = createApp(App)

app.use(createPinia())
app.use(router)
const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{sky.50}',
      100: '{sky.100}',
      200: '{sky.200}',
      300: '{sky.300}',
      400: '{sky.400}',
      500: '{sky.500}',
      600: '{sky.600}',
      700: '{sky.700}',
      800: '{sky.800}',
      900: '{sky.900}',
      950: '{sky.950}',
    },
  },
})
app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: { darkModeSelector: false },
  },
})
app.directive('click-outside', clickOutsideDirective)
const options = {
  position: POSITION.BOTTOM_RIGHT,
  hideProgressBar: true,
  closeButton: false,
  closeOnClick: false,
}
app.use(Toast, options)
app.use(ConfirmationService)

app.mount('#root')
