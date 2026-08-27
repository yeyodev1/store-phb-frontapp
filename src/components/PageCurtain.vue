<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { registerCurtain } from '@/composables/usePageTransition'

const root = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const center = ref<HTMLElement | null>(null)
const mark = ref<HTMLElement | null>(null)

onMounted(() => {
  if (root.value && panel.value && center.value && mark.value) {
    registerCurtain({
      root: root.value,
      panel: panel.value,
      center: center.value,
      mark: mark.value,
    })
  }
})
</script>

<template>
  <div ref="root" class="curtain" aria-hidden="true">
    <div ref="panel" class="curtain__panel"></div>
    <div ref="center" class="curtain__center">
      <!-- Marca de espera: pulso clínico dentro de un anillo dorado. -->
      <div ref="mark" class="curtain__mark">
        <svg viewBox="0 0 120 120">
          <defs>
            <linearGradient id="curtainPulse" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#21BCFB" />
              <stop offset="100%" stop-color="#18E7F0" />
            </linearGradient>
          </defs>
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="#C9A96A"
            stroke-width="2"
            stroke-opacity="0.45"
            stroke-dasharray="4 10"
            stroke-linecap="round"
          />
          <circle
            cx="60"
            cy="60"
            r="38"
            fill="none"
            stroke="#C9A96A"
            stroke-width="1.5"
            stroke-opacity="0.85"
          />
          <path
            d="M28 60 h14 l7 -16 l10 32 l8 -22 l6 6 h19"
            fill="none"
            stroke="url(#curtainPulse)"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <img src="/img/logo-white.png" alt="Juan Román Garza" class="curtain__logo" />
      <span class="curtain__method">COMPRENDER · DECIDIR · ACTUAR · MEDIR · REGENERAR</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.curtain {
  position: fixed;
  inset: 0;
  z-index: 200;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &__panel {
    position: absolute;
    inset: 0;
    background: $mesh-navy;
    will-change: transform;
  }

  &__center {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;
    will-change: opacity, transform;
  }

  &__mark {
    width: clamp(64px, 12vw, 92px);
    filter: drop-shadow(0 12px 30px rgba(33, 188, 251, 0.35));
  }

  &__logo {
    height: 26px;
    width: auto;
    opacity: 0.95;
  }

  &__method {
    font-size: 0.56rem;
    letter-spacing: 0.24em;
    color: rgba(255, 255, 255, 0.42);
    text-align: center;
    padding-inline: 1rem;
  }
}
</style>
