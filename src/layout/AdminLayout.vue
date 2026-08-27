<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const user = useUserStore()
const open = ref(false)

const nav = [
  { to: '/admin', label: 'Dashboard', exact: true, icon: 'fa-solid fa-gauge-high' },
  { to: '/admin/productos', label: 'Productos', icon: 'fa-solid fa-box-open' },
  { to: '/admin/categorias', label: 'Categorías', icon: 'fa-solid fa-tags' },
  { to: '/admin/pedidos', label: 'Pedidos', icon: 'fa-solid fa-receipt' },
  { to: '/admin/usuarios', label: 'Usuarios', icon: 'fa-solid fa-users' },
]

function isActive(item: { to: string; exact?: boolean }) {
  return item.exact ? route.path === item.to : route.path.startsWith(item.to)
}

function logout() {
  user.clear()
  router.push('/login')
}
</script>

<template>
  <div class="admin">
    <aside class="admin__side" :class="{ open }">
      <div class="admin__brand">
        <span class="admin__mark">PB</span>
        <div>
          <strong>PHB Admin</strong>
          <small>PHB</small>
        </div>
      </div>

      <nav class="admin__nav">
        <RouterLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="admin__link"
          :class="{ 'admin__link--active': isActive(item) }"
          @click="open = false"
        >
          <i :class="item.icon"></i>
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="admin__side-foot">
        <RouterLink to="/" class="admin__store-link">
          <i class="fa-solid fa-arrow-left"></i> Ir a la tienda
        </RouterLink>
        <button class="btn btn--ghost btn--sm btn--block" @click="logout">Cerrar sesión</button>
      </div>
    </aside>

    <div class="admin__body">
      <header class="admin__top">
        <button class="admin__burger" @click="open = !open" aria-label="Menú">
          <i class="fa-solid fa-bars"></i>
        </button>
        <div class="admin__user">
          <span class="admin__avatar">{{ user.initials }}</span>
          <div class="admin__user-info">
            <strong>{{ user.name }}</strong>
            <small>Administrador</small>
          </div>
        </div>
      </header>

      <main class="admin__content">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.admin {
  display: flex;
  min-height: 100vh;
  background: $surface;

  &__side {
    width: 264px;
    flex-shrink: 0;
    background: $mesh-navy;
    color: $text-on-navy;
    display: flex;
    flex-direction: column;
    padding: 1.5rem 1.1rem;
    position: sticky;
    top: 0;
    height: 100vh;

    @include until-lg {
      position: fixed;
      z-index: 70;
      left: 0;
      top: 0;
      transform: translateX(-100%);
      transition: transform 0.25s ease;
      &.open { transform: translateX(0); }
    }
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0 0.4rem 1.4rem;
    strong { display: block; color: $white; font-family: $font-principal; }
    small { color: $accent; font-family: $font-accent; font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; }
  }

  &__mark {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px; height: 40px;
    border-radius: 11px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.14);
    color: $accent;
    font-family: $font-principal;
    font-weight: 800;
  }

  &__nav {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    flex: 1;
  }

  &__link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 0.85rem;
    border-radius: 12px;
    font-family: $font-secondary;
    font-weight: 500;
    font-size: 0.94rem;
    color: $text-on-navy;
    transition: background 0.15s ease, color 0.15s ease;
    i { width: 22px; text-align: center; font-size: 1.02rem; opacity: 0.85; }
    &:hover { background: rgba(255, 255, 255, 0.07); color: $white; }
    &--active { background: rgba(33, 188, 251, 0.18); color: $white; }
    &--active i { color: $accent; opacity: 1; }
  }

  &__side-foot {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  &__store-link {
    font-size: 0.85rem;
    color: $accent;
    text-align: center;
  }

  &__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.9rem 1.5rem;
    background: $white;
    border-bottom: 1px solid $border;
    position: sticky;
    top: 0;
    z-index: 20;
  }

  &__burger {
    font-size: 1.4rem;
    color: $navy;
    @include lg { display: none; }
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-left: auto;
  }

  &__avatar {
    width: 40px; height: 40px;
    border-radius: 50%;
    background: $grad-navy;
    color: $accent;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: $font-accent;
    font-weight: 700;
    font-size: 0.85rem;
  }

  &__user-info {
    display: flex;
    flex-direction: column;
    line-height: 1.1;
    strong { font-size: 0.9rem; }
    small { color: $text-secondary; font-size: 0.76rem; }
  }

  &__content {
    flex: 1;
    padding: clamp(1.2rem, 3vw, 2.2rem);
  }
}
</style>
