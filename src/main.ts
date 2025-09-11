import '@/assets/css/style.css'
import 'primeicons/primeicons.css'
import 'vue-toastification/dist/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura'
import Toast, { POSITION } from 'vue-toastification'
import clickOutsideDirective from '@/directives/click-outside'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {},
    },
});
app.directive('click-outside', clickOutsideDirective)
const options = {
    position: POSITION.BOTTOM_RIGHT,
    hideProgressBar: true,
    closeButton: false,
    closeOnClick: false,
}
app.use(Toast, options)

app.mount('#root')
