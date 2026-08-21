<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/composables/useFormat'
import ProductImage from './ProductImage.vue'
import QuantityStepper from './QuantityStepper.vue'

const cart = useCartStore()
const router = useRouter()

function goCheckout() {
  cart.close()
  router.push('/checkout')
}
function goCart() {
  cart.close()
  router.push('/carrito')
}
</script>

<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="cart.isOpen" class="drawer__overlay" @click="cart.close()" />
    </transition>
    <transition name="slide">
      <aside v-if="cart.isOpen" class="drawer" role="dialog" aria-label="Carrito de compras">
        <header class="drawer__head">
          <h3>Tu carrito <span v-if="cart.count">({{ cart.count }})</span></h3>
          <button class="drawer__close" @click="cart.close()" aria-label="Cerrar">✕</button>
        </header>

        <div v-if="cart.isEmpty" class="drawer__empty">
          <ProductImage label="Vacío" ratio="1 / 1" />
          <p>Tu carrito está vacío</p>
          <button class="btn btn--primary" @click="goCart">Explorar la tienda</button>
        </div>

        <div v-else class="drawer__lines">
          <div v-for="line in cart.lines" :key="line.productId" class="drawer__line">
            <div class="drawer__thumb">
              <ProductImage :src="line.image" :label="line.modelCode" />
            </div>
            <div class="drawer__info">
              <strong>{{ line.name }}</strong>
              <span class="drawer__price">{{ formatPrice(line.price) }}</span>
              <div class="drawer__row">
                <QuantityStepper
                  :model-value="line.quantity"
                  @update:model-value="(v) => cart.setQuantity(line.productId, v)"
                />
                <button class="drawer__remove" @click="cart.remove(line.productId)">Quitar</button>
              </div>
            </div>
          </div>
        </div>

        <footer v-if="!cart.isEmpty" class="drawer__foot">
          <div class="drawer__subtotal">
            <span>Subtotal</span>
            <strong>{{ formatPrice(cart.subtotal) }}</strong>
          </div>
          <button class="btn btn--primary btn--block btn--lg" @click="goCheckout">
            Finalizar compra
          </button>
          <button class="btn btn--ghost btn--block" @click="goCart">Ver carrito</button>
        </footer>
      </aside>
    </transition>
  </teleport>
</template>

<style scoped lang="scss">
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 90;
  width: min(420px, 92vw);
  height: 100dvh;
  background: $white;
  display: flex;
  flex-direction: column;
  box-shadow: $shadow-lg;

  &__overlay {
    position: fixed;
    inset: 0;
    z-index: 80;
    background: rgba(7, 16, 35, 0.5);
    backdrop-filter: blur(2px);
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.3rem 1.4rem;
    border-bottom: 1px solid $border;
    h3 { font-size: 1.15rem; }
  }

  &__close {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    color: $text-secondary;
    &:hover { background: $surface-2; }
  }

  &__empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 2rem;
    text-align: center;
    color: $text-secondary;
    > div { width: 120px; border-radius: 20px; }
  }

  &__lines {
    flex: 1;
    overflow-y: auto;
    padding: 1rem 1.4rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__line {
    display: flex;
    gap: 0.9rem;
  }

  &__thumb {
    width: 78px;
    flex-shrink: 0;
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid $border;
  }

  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    strong { font-size: 0.95rem; font-family: $font-principal; }
  }

  &__price {
    font-family: $font-accent;
    font-weight: 600;
    color: $navy;
  }

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }

  &__remove {
    font-size: 0.82rem;
    color: $error;
    &:hover { text-decoration: underline; }
  }

  &__foot {
    border-top: 1px solid $border;
    padding: 1.3rem 1.4rem;
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }

  &__subtotal {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    span { color: $text-secondary; }
    strong { font-family: $font-accent; font-size: 1.4rem; color: $navy; }
  }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
