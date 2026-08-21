<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { site } from '@/config/site'

const cart = useCartStore()
const user = useUserStore()
const route = useRoute()

const mobileOpen = ref(false)

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/tienda', label: 'Tienda' },
  { to: '/tienda?category=ionizadores', label: 'Ionizadores' },
  { to: '/beneficios', label: 'Beneficios' },
]

function closeMobile() {
  mobileOpen.value = false
}
</script>

<template>
  <header class="header">
    <div class="header__bar">
      <RouterLink to="/" class="header__logo" @click="closeMobile">
        <span class="header__logo-mark">PB</span>
        <span class="header__logo-text">
          <strong>PowerHouse</strong>
          <small>Agua Kangen</small>
        </span>
      </RouterLink>

      <nav class="header__nav">
        <RouterLink
          v-for="l in links"
          :key="l.label"
          :to="l.to"
          class="header__link"
          :class="{ 'header__link--active': route.fullPath === l.to }"
        >
          {{ l.label }}
        </RouterLink>
      </nav>

      <div class="header__actions">
        <RouterLink
          :to="user.isAuthenticated ? '/cuenta' : '/login'"
          class="header__icon-btn"
          :aria-label="user.isAuthenticated ? 'Mi cuenta' : 'Iniciar sesión'"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
            <circle cx="12" cy="8" r="3.6" />
            <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" stroke-linecap="round" />
          </svg>
        </RouterLink>

        <button class="header__icon-btn header__cart" @click="cart.open()" aria-label="Carrito">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
            <path d="M6 6h15l-1.6 9.5a2 2 0 0 1-2 1.7H9.6a2 2 0 0 1-2-1.7L6 4H3" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none" />
          </svg>
          <span v-if="cart.count" class="header__badge">{{ cart.count }}</span>
        </button>

        <button
          class="header__icon-btn header__burger"
          @click="mobileOpen = !mobileOpen"
          :aria-expanded="mobileOpen"
          aria-label="Menú"
        >
          <span :class="{ open: mobileOpen }"></span>
        </button>
      </div>
    </div>

    <transition name="drop">
      <nav v-if="mobileOpen" class="header__mobile">
        <RouterLink
          v-for="l in links"
          :key="l.label"
          :to="l.to"
          class="header__mobile-link"
          @click="closeMobile"
        >
          {{ l.label }}
        </RouterLink>
        <a :href="`https://wa.me/${site.contact.whatsapp}`" class="btn btn--gold btn--block" target="_blank" rel="noopener">
          Asesoría por WhatsApp
        </a>
      </nav>
    </transition>
  </header>
</template>

<style scoped lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid $border;

  &__bar {
    @include container;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    height: 72px;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 0.65rem;
  }

  &__logo-mark {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: $grad-navy;
    color: $accent;
    font-family: $font-principal;
    font-weight: 800;
    font-size: 1.05rem;
    letter-spacing: -0.03em;
    box-shadow: $shadow-sm;
  }

  &__logo-text {
    display: flex;
    flex-direction: column;
    line-height: 1.05;
    strong { font-family: $font-principal; font-size: 1.02rem; color: $navy; }
    small { font-family: $font-accent; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; color: $cyan-strong; }
  }

  &__nav {
    display: none;
    align-items: center;
    gap: 0.4rem;

    @include lg {
      display: flex;
    }
  }

  &__link {
    font-family: $font-secondary;
    font-weight: 500;
    font-size: 0.95rem;
    color: $text;
    padding: 0.5rem 0.85rem;
    border-radius: 999px;
    transition: background 0.15s ease, color 0.15s ease;
    &:hover { background: $surface-2; color: $cyan-strong; }
    &--active { color: $cyan-strong; }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  &__icon-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    color: $navy;
    transition: background 0.15s ease;
    &:hover { background: $surface-2; }
    svg { width: 22px; height: 22px; }
  }

  &__badge {
    position: absolute;
    top: 4px;
    right: 4px;
    min-width: 18px;
    height: 18px;
    padding: 0 4px;
    border-radius: 999px;
    background: $grad-water;
    color: #04263c;
    font-family: $font-accent;
    font-size: 0.68rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__burger {
    @include lg { display: none; }
    span, span::before, span::after {
      content: '';
      display: block;
      width: 20px;
      height: 2px;
      background: $navy;
      border-radius: 2px;
      transition: transform 0.2s ease, opacity 0.2s ease;
    }
    span { position: relative; }
    span::before { position: absolute; top: -6px; }
    span::after { position: absolute; top: 6px; }
    span.open { background: transparent; }
    span.open::before { transform: translateY(6px) rotate(45deg); }
    span.open::after { transform: translateY(-6px) rotate(-45deg); }
  }

  &__mobile {
    @include container;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding-bottom: 1.2rem;

    @include lg { display: none; }
  }

  &__mobile-link {
    font-family: $font-secondary;
    font-weight: 500;
    padding: 0.85rem 0.5rem;
    border-bottom: 1px solid $border;
    color: $text;
  }
}

.drop-enter-active, .drop-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.drop-enter-from, .drop-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
