<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import type { Product } from '@/types'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { formatPrice } from '@/composables/useFormat'
import { canAddToCart, getCtaLabel, getGateTarget, isLeadMagnet, isPhysical, isPriceOnRequest, showsPrice } from '@/utils/product'
import ProductImage from './ProductImage.vue'

const props = defineProps<{ product: Product }>()

const cart = useCartStore()
const toast = useToastStore()
const router = useRouter()

const hasDiscount = computed(
  () => !!props.product.compareAtPrice && props.product.compareAtPrice > props.product.price,
)

const purchasable = computed(() => canAddToCart(props.product))
const priceVisible = computed(() => showsPrice(props.product))
const ctaLabel = computed(() => getCtaLabel(props.product))
const isOutOfStock = computed(() => isPhysical(props.product) && props.product.stock <= 0)

function onCtaClick() {
  if (!purchasable.value) {
    router.push(getGateTarget(props.product))
    return
  }
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
      <span v-if="isPhysical(product) && isOutOfStock" class="chip product-card__flag product-card__flag--stock">Agotado</span>
    </RouterLink>

    <div class="product-card__body">
      <span v-if="product.format" class="product-card__eyebrow">{{ product.format }}</span>
      <span v-else class="product-card__model">{{ product.modelCode || 'Enagic' }}</span>

      <RouterLink :to="`/producto/${product.slug}`" class="product-card__title">
        {{ product.name }}
      </RouterLink>
      <p class="product-card__desc">{{ product.shortDescription }}</p>

      <span v-if="product.timeRequired" class="product-card__time">{{ product.timeRequired }}</span>

      <div class="product-card__foot">
        <div class="product-card__price">
          <template v-if="priceVisible">
            <span class="product-card__amount">{{ formatPrice(product.price, product.currency) }}</span>
            <span v-if="hasDiscount" class="product-card__compare">
              {{ formatPrice(product.compareAtPrice as number, product.currency) }}
            </span>
          </template>
          <span v-else-if="isLeadMagnet(product)" class="product-card__amount product-card__amount--free">Gratis</span>
          <span
            v-else-if="isPriceOnRequest(product)"
            class="product-card__amount product-card__amount--tbd"
          >Precio a confirmar</span>
        </div>
        <button class="btn btn--primary btn--sm product-card__add" @click="onCtaClick" :aria-label="ctaLabel">
          <svg v-if="purchasable" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M6 6h15l-1.5 9h-12z" stroke-linejoin="round" />
            <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none" />
            <path d="M6 6 5 3H2" stroke-linecap="round" />
          </svg>
          {{ ctaLabel }}
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

    &--stock {
      left: auto;
      right: 0.85rem;
      background: rgba(239, 68, 68, 0.12);
      color: $error;
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.15rem 1.25rem 1.35rem;
    flex: 1;
  }

  &__model,
  &__eyebrow {
    font-family: $font-accent;
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: $cyan-strong;
    font-weight: 600;
    @include line-clamp(1);
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

  &__time {
    font-size: 0.78rem;
    color: $text-secondary;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
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

    &--free {
      color: $success;
    }

    // Precio que el negocio todavía no define.
    &--tbd {
      font-size: 0.95rem;
      font-weight: 600;
      color: $text-secondary;
    }
  }

  &__compare {
    font-size: 0.82rem;
    color: $text-secondary;
    text-decoration: line-through;
  }
}
</style>
