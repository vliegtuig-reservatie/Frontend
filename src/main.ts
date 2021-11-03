import { createApp } from 'vue'
import App from './App.vue'
import router from './bootstrap/router'
import './assets/style/screen.css'

const app = createApp(App)

app.use(router)
app.mount('#app')