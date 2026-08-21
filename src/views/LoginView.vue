<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'

const user = useUserStore()
const toast = useToastStore()
const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)

async function submit() {
  loading.value = true
  try {
    const u = await user.login(email.value, password.value)
    toast.success(`Bienvenido, ${u.name}`)
    const redirect = route.query.redirect as string
    router.push(redirect || (u.accountType === 'admin' ? '/admin' : '/cuenta'))
  } catch (e) {
    toast.error((e as { message?: string })?.message || 'Credenciales inválidas')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth">
    <div class="auth__card">
      <div class="auth__brand">
        <span class="auth__mark">PB</span>
        <h1>Iniciar sesión</h1>
        <p>Accede a tu cuenta PowerHouse Biotech</p>
      </div>

      <form @submit.prevent="submit" class="auth__form">
        <label class="field">
          <span>Correo electrónico</span>
          <input v-model="email" type="email" required placeholder="tu@email.com" autocomplete="email" />
        </label>
        <label class="field">
          <span>Contraseña</span>
          <input v-model="password" type="password" required placeholder="••••••••" autocomplete="current-password" />
        </label>
        <button type="submit" class="btn btn--primary btn--block btn--lg" :disabled="loading">
          {{ loading ? 'Ingresando…' : 'Ingresar' }}
        </button>
      </form>

      <p class="auth__alt">
        ¿No tienes cuenta?
        <RouterLink to="/registro">Regístrate</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.auth {
  @include container;
  min-height: 76vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-block: 3rem;

  &__card {
    width: 100%;
    max-width: 440px;
    @include card;
    padding: clamp(1.8rem, 5vw, 2.6rem);
    display: flex;
    flex-direction: column;
    gap: 1.4rem;
  }

  &__brand {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    h1 { font-size: 1.7rem; }
    p { color: $text-secondary; font-size: 0.92rem; }
  }
  &__mark {
    width: 54px; height: 54px;
    border-radius: 15px;
    background: $grad-navy;
    color: $accent;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: $font-principal;
    font-weight: 800;
    font-size: 1.2rem;
    margin-bottom: 0.4rem;
  }

  &__form { display: flex; flex-direction: column; gap: 1rem; }
  &__alt { text-align: center; font-size: 0.9rem; color: $text-secondary; a { color: $cyan-strong; font-weight: 600; } }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  span { font-size: 0.85rem; font-weight: 600; }
  input {
    border: 1.5px solid $border-strong;
    border-radius: 12px;
    padding: 0.8rem 0.9rem;
    background: $white;
    &:focus { outline: none; border-color: $cyan; }
  }
}
</style>
