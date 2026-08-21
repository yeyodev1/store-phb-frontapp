import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/user'
import '@/styles/global.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Restore session from localStorage before mount.
const userStore = useUserStore(pinia)
userStore.hydrate()

// Global 401 handler dispatched by APIBase.
window.addEventListener('auth:token-expired', () => {
  userStore.clear()
  if (!location.pathname.startsWith('/login')) {
    router.push('/login')
  }
})

app.mount('#app')
