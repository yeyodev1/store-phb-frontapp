<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Product } from '@/types'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { formatPrice } from '@/composables/useFormat'
import ProductImage from './ProductImage.vue'

const props = defineProps<{ product: Product }>()

const cart = useCartStore()
const toast = useToastStore()

const hasDiscount = computed(
  () => !!props.product.compareAtPrice && props.product.compareAtPrice > props.product.price,
)

function addToCart() {
  cart.add(props.product)
  toast.success(`${props.product.name} agregado al carrito`)
}
</script>

<template>
  <article class="product-card">
    <RouterLink :to="`/producto/${product.slug}`" class="product-card__media">
      <ProductImage :src="product.images?.[0]" :label="product.modelCode" :alt="product.name" contain />
      <span v-if="hasDiscount" class="chip chip--sale product-card__flag">Oferta</span>
      <span v-else-if="product.featured" class="chip chip--gold product-card__flag">Destacado</span>
    </RouterLink>

    <div class="product-card__body">
      <span class="product-card__model">{{ product.modelCode || 'Enagic' }}</span>
      <RouterLink :to="`/producto/${product.slug}`" class="product-card__title">
        {{ product.name }}
      </RouterLink>
      <p class="product-card__desc">{{ product.shortDescription }}</p>

      <div class="product-card__foot">
        <div class="product-card__price">
          <span class="product-card__amount">{{ formatPrice(product.price, product.currency) }}</span>
          <span v-if="hasDiscount" class="product-card__compare">
            {{ formatPrice(product.compareAtPrice as number, product.currency) }}
          </span>
        </div>
        <button class="btn btn--primary btn--sm product-card__add" @click="addToCart" aria-label="Agregar al carrito">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M6 6h15l-1.5 9h-12z" stroke-linejoin="round" />
            <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none" />
            <path d="M6 6 5 3H2" stroke-linecap="round" />
          </svg>
          Agregar
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.product-card {
  display: flex;
  flex-direction: column;
  background: $white;
  border: 1px solid $border;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: $shadow-xs;
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: $shadow-md;
    border-color: rgba(33, 188, 251, 0.35);
  }

  &__media {
    position: relative;
    display: block;
  }

  &__flag {
    position: absolute;
    top: 0.85rem;
    left: 0.85rem;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.15rem 1.25rem 1.35rem;
    flex: 1;
  }

  &__model {
    font-family: $font-accent;
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: $cyan-strong;
    font-weight: 600;
  }

  &__title {
    font-family: $font-principal;
    font-weight: 700;
    font-size: 1.14rem;
    color: $text;
    line-height: 1.2;
    &:hover { color: $cyan-strong; }
  }

  &__desc {
    font-size: 0.9rem;
    color: $text-secondary;
    @include line-clamp(2);
    flex: 1;
  }

  &__foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-top: 0.35rem;
    flex-wrap: wrap;
  }

  &__price {
    display: flex;
    flex-direction: column;
    line-height: 1.1;
  }

  &__amount {
    font-family: $font-accent;
    font-weight: 700;
    font-size: 1.3rem;
    color: $navy;
  }

  &__compare {
    font-size: 0.82rem;
    color: $text-secondary;
    text-decoration: line-through;
  }
}
</style>
