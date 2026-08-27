<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/composables/useFormat'
import ProductImage from '@/components/ProductImage.vue'
import QuantityStepper from '@/components/QuantityStepper.vue'

const cart = useCartStore()
const router = useRouter()
</script>

<template>
  <div class="cart">
    <h1 class="cart__title">Tu carrito</h1>

    <div v-if="cart.isEmpty" class="cart__empty">
      <div class="cart__empty-drop"><ProductImage label="Vacío" /></div>
      <h3>Tu carrito está vacío</h3>
      <p>Explora la biblioteca y empieza por entender dónde estás.</p>
      <RouterLink to="/tienda" class="btn btn--primary btn--lg">Ir a la tienda</RouterLink>
    </div>

    <div v-else class="cart__grid">
      <div class="cart__lines">
        <article v-for="line in cart.lines" :key="line.productId" class="cart__line">
          <RouterLink :to="`/producto/${line.slug}`" class="cart__thumb">
            <ProductImage :src="line.image" :label="line.modelCode" />
          </RouterLink>
          <div class="cart__line-body">
            <div class="cart__line-head">
              <div>
                <RouterLink :to="`/producto/${line.slug}`" class="cart__name">{{ line.name }}</RouterLink>
                <span class="cart__model">{{ line.modelCode }}</span>
              </div>
              <button class="cart__remove" @click="cart.remove(line.productId)" aria-label="Quitar"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="cart__line-foot">
              <QuantityStepper
                :model-value="line.quantity"
                @update:model-value="(v) => cart.setQuantity(line.productId, v)"
              />
              <strong class="cart__line-total">{{ formatPrice(line.price * line.quantity) }}</strong>
            </div>
          </div>
        </article>
      </div>

      <aside class="cart__summary">
        <h3>Resumen</h3>
        <div class="cart__row"><span>Subtotal</span><strong>{{ formatPrice(cart.subtotal) }}</strong></div>
        <div class="cart__row"><span>Envío</span><span class="cart__free">Coordinado</span></div>
        <div class="cart__total"><span>Total</span><strong>{{ formatPrice(cart.subtotal) }}</strong></div>
        <button class="btn btn--primary btn--block btn--lg" @click="router.push('/checkout')">
          Finalizar compra
        </button>
        <RouterLink to="/tienda" class="btn btn--ghost btn--block">Seguir comprando</RouterLink>
      </aside>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cart {
  @include container;
  padding-block: 2.5rem 4rem;
  &__title { font-size: clamp(1.8rem, 4vw, 2.6rem); margin-bottom: 1.8rem; }

  &__empty {
    text-align: center;
    padding: 3rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color: $text-secondary;
  }
  &__empty-drop { width: 140px; border-radius: 24px; overflow: hidden; }

  &__grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1.8rem;
    align-items: flex-start;
  }

  &__lines {
    flex: 1 1 420px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__line {
    display: flex;
    gap: 1rem;
    @include card;
    padding: 1rem;
  }

  &__thumb { width: 110px; flex-shrink: 0; border-radius: 14px; overflow: hidden; }

  &__line-body { flex: 1; display: flex; flex-direction: column; justify-content: space-between; gap: 0.8rem; }
  &__line-head { display: flex; justify-content: space-between; gap: 0.5rem; }
  &__name { font-family: $font-principal; font-weight: 700; font-size: 1.1rem; display: block; }
  &__model { font-size: 0.8rem; color: $cyan-strong; font-family: $font-accent; text-transform: uppercase; letter-spacing: 0.06em; }
  &__remove { width: 34px; height: 34px; border-radius: 9px; color: $text-secondary; &:hover { background: $surface-2; color: $error; } }
  &__line-foot { display: flex; align-items: center; justify-content: space-between; }
  &__line-total { font-family: $font-accent; font-size: 1.2rem; color: $navy; }

  &__summary {
    flex: 1 1 300px;
    position: sticky;
    top: 90px;
    @include card;
    padding: 1.6rem;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    h3 { margin-bottom: 0.4rem; }
  }
  &__row { display: flex; justify-content: space-between; color: $text-secondary; }
  &__free { color: $success; font-weight: 600; }
  &__total {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding-top: 0.8rem;
    margin-top: 0.4rem;
    border-top: 1px solid $border;
    span { font-weight: 600; }
    strong { font-family: $font-accent; font-size: 1.6rem; color: $navy; }
  }
}
</style>
