import { createApp } from 'vue'
import App from './App.vue'
import router from './bootstrap/router'
import './assets/style/screen.css'
import useFirebase from './composables/useFirebase'

const app = createApp(App)

const { restoreAuth } = useFirebase()

await restoreAuth()

console.log('mount app')
app.use(router)
app.mount('#app')
