<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { registerCurtain } from '@/composables/usePageTransition'

const root = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const center = ref<HTMLElement | null>(null)
const drop = ref<HTMLElement | null>(null)

onMounted(() => {
  if (root.value && panel.value && center.value && drop.value) {
    registerCurtain({
      root: root.value,
      panel: panel.value,
      center: center.value,
      drop: drop.value,
    })
  }
})
</script>

<template>
  <div ref="root" class="curtain" aria-hidden="true">
    <div ref="panel" class="curtain__panel"></div>
    <div ref="center" class="curtain__center">
      <div ref="drop" class="curtain__drop">
        <svg viewBox="0 0 120 150">
          <defs>
            <linearGradient id="curtainDrop" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#2094D2" />
              <stop offset="55%" stop-color="#21BCFB" />
              <stop offset="100%" stop-color="#18E7F0" />
            </linearGradient>
          </defs>
          <path d="M60 8 C60 8 108 66 108 100 A48 48 0 0 1 12 100 C12 66 60 8 60 8 Z" fill="url(#curtainDrop)" />
          <ellipse cx="44" cy="92" rx="13" ry="19" fill="rgba(255,255,255,0.4)" />
        </svg>
      </div>
      <img src="/img/logo-white.png" alt="PowerHouse Biotech" class="curtain__logo" />
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
    gap: 1.4rem;
    will-change: opacity, transform;
  }

  &__drop {
    width: clamp(60px, 12vw, 96px);
    filter: drop-shadow(0 16px 34px rgba(33, 188, 251, 0.5));
  }

  &__logo {
    height: 30px;
    width: auto;
    opacity: 0.95;
  }
}
</style>
