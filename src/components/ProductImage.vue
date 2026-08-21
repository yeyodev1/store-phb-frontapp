<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    src?: string
    alt?: string
    label?: string
    ratio?: string
  }>(),
  { ratio: '1 / 1' },
)

const hasImage = computed(() => !!props.src)
</script>

<template>
  <div class="product-image" :style="{ aspectRatio: ratio }">
    <img v-if="hasImage" :src="src" :alt="alt || label || 'Producto'" loading="lazy" />
    <div v-else class="product-image__placeholder">
      <svg viewBox="0 0 120 150" class="product-image__drop" aria-hidden="true">
        <defs>
          <linearGradient id="drop" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#2094D2" />
            <stop offset="55%" stop-color="#21BCFB" />
            <stop offset="100%" stop-color="#18E7F0" />
          </linearGradient>
        </defs>
        <path
          d="M60 8 C60 8 108 66 108 100 A48 48 0 0 1 12 100 C12 66 60 8 60 8 Z"
          fill="url(#drop)"
        />
        <ellipse cx="44" cy="92" rx="14" ry="20" fill="rgba(255,255,255,0.35)" />
      </svg>
      <span v-if="label" class="product-image__label">{{ label }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.product-image {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: inherit;
  background: $surface-2;
  display: flex;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__placeholder {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    background:
      radial-gradient(at 30% 20%, rgba(33, 188, 251, 0.14) 0%, transparent 60%),
      linear-gradient(160deg, #f2f8fe 0%, #e6eef7 100%);
  }

  &__drop {
    width: 42%;
    max-width: 96px;
    filter: drop-shadow(0 12px 22px rgba(33, 188, 251, 0.32));
    animation: float 5s ease-in-out infinite;
  }

  &__label {
    font-family: $font-accent;
    font-weight: 600;
    font-size: 0.82rem;
    letter-spacing: 0.04em;
    color: $cyan-strong;
    text-transform: uppercase;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
</style>
