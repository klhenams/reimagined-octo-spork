import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
// import Aura from '@primevue/themes/aura'
import 'primeicons/primeicons.css'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

const app = createApp(App)

app.use(PrimeVue,{ unstyled: true });
app.use(router).mount('#app')

app
    .component('Button', Button)
    .component('InputText', InputText)
