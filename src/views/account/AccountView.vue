<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { authService } from '@/services/auth.service'

const user = useUserStore()
const toast = useToastStore()
const router = useRouter()

const form = reactive({ name: '', phone: '', password: '' })
const saving = ref(false)

onMounted(async () => {
  form.name = user.name || ''
  try {
    const me = await authService.me()
    form.name = me.name
  } catch {}
})

async function save() {
  saving.value = true
  try {
    const payload: Record<string, unknown> = { name: form.name, phone: form.phone }
    if (form.password) payload.password = form.password
    const updated = await authService.updateMe(payload)
    user.name = updated.name
    try { localStorage.setItem('user_name', updated.name) } catch {}
    form.password = ''
    toast.success('Perfil actualizado')
  } catch (e) {
    toast.error((e as { message?: string })?.message || 'No se pudo guardar')
  } finally {
    saving.value = false
  }
}

function logout() {
  user.clear()
  toast.info('Sesión cerrada')
  router.push('/')
}
</script>

<template>
  <div class="account">
    <header class="account__hero">
      <div class="account__hero-inner">
        <span class="account__avatar">{{ user.initials }}</span>
        <div>
          <h1>Hola, {{ user.name }}</h1>
          <p>{{ user.email }}</p>
        </div>
      </div>
    </header>

    <div class="account__body">
      <div class="account__cards">
        <RouterLink to="/cuenta/pedidos" class="account__tile">
          <h3>Mis pedidos</h3>
          <p>Revisa el estado de tus compras</p>
          <span>Ver pedidos →</span>
        </RouterLink>
        <RouterLink v-if="user.isAdmin" to="/admin" class="account__tile account__tile--admin">
          <h3>Panel de administración</h3>
          <p>Gestiona productos, pedidos y usuarios</p>
          <span>Ir al panel →</span>
        </RouterLink>
      </div>

      <section class="account__form-card">
        <h2>Datos de la cuenta</h2>
        <form @submit.prevent="save">
          <label class="field">
            <span>Nombre</span>
            <input v-model="form.name" type="text" required />
          </label>
          <label class="field">
            <span>Teléfono</span>
            <input v-model="form.phone" type="tel" placeholder="09..." />
          </label>
          <label class="field">
            <span>Nueva contraseña (opcional)</span>
            <input v-model="form.password" type="password" placeholder="Dejar en blanco para no cambiar" />
          </label>
          <div class="account__actions">
            <button type="submit" class="btn btn--primary" :disabled="saving">
              {{ saving ? 'Guardando…' : 'Guardar cambios' }}
            </button>
            <button type="button" class="btn btn--ghost" @click="logout">Cerrar sesión</button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.account {
  &__hero { background: $grad-navy; color: $white; }
  &__hero-inner {
    @include container;
    padding-block: 2.5rem;
    display: flex;
    align-items: center;
    gap: 1.1rem;
    h1 { color: $white; font-size: clamp(1.5rem, 3.5vw, 2.2rem); }
    p { color: $text-on-navy; }
  }
  &__avatar {
    width: 64px; height: 64px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: $accent;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: $font-accent;
    font-weight: 700;
    font-size: 1.3rem;
  }

  &__body { @include container; padding-block: 2.2rem; display: flex; flex-direction: column; gap: 1.6rem; }

  &__cards { display: flex; flex-wrap: wrap; gap: 1.2rem; }
  &__tile {
    flex: 1 1 240px;
    @include card;
    padding: 1.6rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    p { color: $text-secondary; font-size: 0.9rem; flex: 1; }
    span { color: $cyan-strong; font-family: $font-accent; font-weight: 600; }
    &:hover { transform: translateY(-4px); box-shadow: $shadow-md; }
    &--admin { background: $grad-navy; color: $white; h3 { color: $white; } p { color: $text-on-navy; } span { color: $accent; } }
  }

  &__form-card {
    @include card;
    padding: 1.8rem;
    max-width: 520px;
    h2 { margin-bottom: 1.2rem; font-size: 1.3rem; }
    form { display: flex; flex-direction: column; gap: 1rem; }
  }

  &__actions { display: flex; flex-wrap: wrap; gap: 0.7rem; margin-top: 0.4rem; }
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
    &:focus { outline: none; border-color: $cyan; }
  }
}
</style>
