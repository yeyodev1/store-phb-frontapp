<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    src?: string
    alt?: string
    label?: string
    ratio?: string
    contain?: boolean
  }>(),
  { ratio: '1 / 1', contain: false },
)

const hasImage = computed(() => !!props.src)
</script>

<template>
  <div class="product-image" :style="{ aspectRatio: ratio }">
    <img
      v-if="hasImage"
      :src="src"
      :alt="alt || label || 'Producto'"
      loading="lazy"
      :class="{ 'is-contain': contain }"
    />
    <div v-else class="product-image__placeholder">
      <svg viewBox="0 0 120 120" class="product-image__mark" aria-hidden="true">
        <defs>
          <linearGradient id="phbPulse" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#2094D2" />
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
          stroke-opacity="0.5"
          stroke-dasharray="4 10"
          stroke-linecap="round"
        />
        <path
          d="M28 60 h14 l7 -16 l10 32 l8 -22 l6 6 h19"
          fill="none"
          stroke="url(#phbPulse)"
          stroke-width="4.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
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
    &.is-contain {
      object-fit: contain;
      padding: 8%;
      background:
        radial-gradient(at 50% 35%, rgba(33, 188, 251, 0.08) 0%, transparent 60%),
        linear-gradient(160deg, #ffffff 0%, #eef4fa 100%);
      mix-blend-mode: multiply;
    }
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

  &__mark {
    width: 38%;
    max-width: 88px;
    filter: drop-shadow(0 12px 22px rgba(33, 188, 251, 0.22));
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
