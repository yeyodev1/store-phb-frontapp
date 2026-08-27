<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { ordersService } from '@/services/orders.service'
import { useUserStore } from '@/stores/user'
import { formatPrice } from '@/composables/useFormat'
import { site } from '@/config/site'
import type { Order } from '@/types'

const route = useRoute()
const user = useUserStore()
const order = ref<Order | null>(null)
const loading = ref(true)

onMounted(async () => {
  const num = route.params.orderNumber as string
  try {
    const raw = localStorage.getItem('phb_last_order')
    if (raw) {
      const parsed = JSON.parse(raw) as Order
      if (parsed.orderNumber === num) order.value = parsed
    }
  } catch {}
  if (!order.value && user.isAuthenticated) {
    order.value = await ordersService.getByNumber(num).catch(() => null)
  }
  loading.value = false
})
</script>

<template>
  <div class="confirm">
    <div class="confirm__card">
      <div class="confirm__check">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </div>
      <h1>¡Gracias por tu pedido!</h1>
      <p class="confirm__lead">
        Hemos recibido tu solicitud. Acceso inmediato tras confirmar tu pago: te enviamos el acceso
        por correo y un asesor te contactará para acompañarte.
      </p>
      <p class="confirm__num">Pedido <strong>{{ route.params.orderNumber }}</strong></p>

      <div v-if="order" class="confirm__detail">
        <ul>
          <li v-for="item in order.items" :key="item.name">
            <span>{{ item.quantity }}× {{ item.name }}</span>
            <strong>{{ formatPrice(item.price * item.quantity, order.currency) }}</strong>
          </li>
        </ul>
        <div class="confirm__total"><span>Total</span><strong>{{ formatPrice(order.total, order.currency) }}</strong></div>
      </div>

      <div class="confirm__actions">
        <a :href="`https://wa.me/${site.contact.whatsapp}?text=Hola,%20acabo%20de%20realizar%20el%20pedido%20${route.params.orderNumber}`"
           class="btn btn--gold btn--lg" target="_blank" rel="noopener">
          Confirmar por WhatsApp
        </a>
        <RouterLink to="/tienda" class="btn btn--ghost btn--lg">Seguir comprando</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.confirm {
  @include container;
  padding-block: 3.5rem 5rem;
  display: flex;
  justify-content: center;

  &__card {
    max-width: 560px;
    width: 100%;
    @include card;
    padding: clamp(1.8rem, 5vw, 3rem);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.9rem;
    h1 { font-size: clamp(1.6rem, 4vw, 2.2rem); }
  }

  &__check {
    width: 76px; height: 76px;
    border-radius: 50%;
    background: rgba(16, 185, 129, 0.12);
    color: $success;
    display: flex;
    align-items: center;
    justify-content: center;
    svg { width: 38px; height: 38px; }
  }

  &__lead { color: $text-secondary; }
  &__num { font-family: $font-accent; color: $navy; strong { color: $cyan-strong; } }

  &__detail {
    width: 100%;
    margin-top: 0.5rem;
    text-align: left;
    ul { display: flex; flex-direction: column; gap: 0.6rem; }
    li { display: flex; justify-content: space-between; gap: 1rem; padding: 0.5rem 0; border-bottom: 1px solid $border; }
  }
  &__total {
    display: flex;
    justify-content: space-between;
    padding-top: 0.8rem;
    strong { font-family: $font-accent; font-size: 1.4rem; color: $navy; }
  }

  &__actions { display: flex; flex-wrap: wrap; gap: 0.8rem; justify-content: center; margin-top: 1rem; }
}
</style>
