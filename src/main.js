import { createApp, watch } from "vue"
import { createPinia } from 'pinia'
import { VueQueryPlugin } from "vue-query"

import App from './App.vue'
import { router } from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(VueQueryPlugin)

app.mount('#app')
