<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { ordersService } from '@/services/orders.service'
import { formatPrice } from '@/composables/useFormat'
import type { CustomerInfo } from '@/types'

const cart = useCartStore()
const user = useUserStore()
const toast = useToastStore()
const router = useRouter()

const submitting = ref(false)

const form = reactive<CustomerInfo>({
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  province: '',
  country: 'Ecuador',
  notes: '',
})

onMounted(() => {
  if (cart.isEmpty) router.replace('/carrito')
  if (user.isAuthenticated) {
    form.name = user.name || ''
    form.email = user.email || ''
  }
})

async function submit() {
  if (!form.name || !form.email) {
    toast.error('Completa tu nombre y correo')
    return
  }
  submitting.value = true
  try {
    const order = await ordersService.create({
      items: cart.lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
      customer: { ...form },
    })
    try {
      localStorage.setItem('phb_last_order', JSON.stringify(order))
    } catch {}
    cart.clear()
    toast.success('¡Pedido recibido!')
    router.push(`/pedido/${order.orderNumber}`)
  } catch (e) {
    const msg = (e as { message?: string })?.message || 'No se pudo crear el pedido'
    toast.error(msg)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="checkout">
    <h1 class="checkout__title">Finalizar compra</h1>

    <form class="checkout__grid" @submit.prevent="submit">
      <div class="checkout__form">
        <section class="checkout__card">
          <h3>Datos de contacto</h3>
          <div class="field-row">
            <label class="field">
              <span>Nombre completo *</span>
              <input v-model="form.name" type="text" required placeholder="Tu nombre" />
            </label>
            <label class="field">
              <span>Correo electrónico *</span>
              <input v-model="form.email" type="email" required placeholder="tu@email.com" />
            </label>
          </div>
          <label class="field">
            <span>Teléfono / WhatsApp</span>
            <input v-model="form.phone" type="tel" placeholder="09..." />
          </label>
        </section>

        <section class="checkout__card">
          <h3>Envío</h3>
          <label class="field">
            <span>Dirección</span>
            <input v-model="form.address" type="text" placeholder="Calle, número, referencia" />
          </label>
          <div class="field-row">
            <label class="field"><span>Ciudad</span><input v-model="form.city" type="text" /></label>
            <label class="field"><span>Provincia</span><input v-model="form.province" type="text" /></label>
          </div>
          <label class="field">
            <span>Notas para el pedido</span>
            <textarea v-model="form.notes" rows="3" placeholder="Horario de entrega, referencias..."></textarea>
          </label>
        </section>
      </div>

      <aside class="checkout__summary">
        <h3>Tu pedido</h3>
        <ul class="checkout__items">
          <li v-for="line in cart.lines" :key="line.productId">
            <span class="checkout__qty">{{ line.quantity }}×</span>
            <span class="checkout__name">{{ line.name }}</span>
            <span class="checkout__price">{{ formatPrice(line.price * line.quantity) }}</span>
          </li>
        </ul>
        <div class="checkout__row"><span>Subtotal</span><strong>{{ formatPrice(cart.subtotal) }}</strong></div>
        <div class="checkout__row"><span>Envío</span><span class="checkout__free">Coordinado</span></div>
        <div class="checkout__total"><span>Total</span><strong>{{ formatPrice(cart.subtotal) }}</strong></div>
        <button type="submit" class="btn btn--primary btn--block btn--lg" :disabled="submitting">
          {{ submitting ? 'Procesando…' : 'Confirmar pedido' }}
        </button>
        <p class="checkout__note">Te contactaremos para coordinar pago y entrega.</p>
      </aside>
    </form>
  </div>
</template>

<style scoped lang="scss">
.checkout {
  @include container;
  padding-block: 2.5rem 4rem;
  &__title { font-size: clamp(1.8rem, 4vw, 2.6rem); margin-bottom: 1.8rem; }

  &__grid { display: flex; flex-wrap: wrap; gap: 1.8rem; align-items: flex-start; }
  &__form { flex: 1 1 420px; display: flex; flex-direction: column; gap: 1.2rem; }

  &__card {
    @include card;
    padding: 1.6rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    h3 { margin-bottom: 0.2rem; }
  }

  &__summary {
    flex: 1 1 300px;
    position: sticky;
    top: 90px;
    @include card;
    padding: 1.6rem;
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    padding-bottom: 0.8rem;
    margin-bottom: 0.4rem;
    border-bottom: 1px solid $border;
    li { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; }
  }
  &__qty { color: $cyan-strong; font-family: $font-accent; font-weight: 600; }
  &__name { flex: 1; @include line-clamp(1); }
  &__price { font-family: $font-accent; font-weight: 600; }

  &__row { display: flex; justify-content: space-between; color: $text-secondary; }
  &__free { color: $success; font-weight: 600; }
  &__total {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding-top: 0.7rem;
    border-top: 1px solid $border;
    margin-top: 0.3rem;
    strong { font-family: $font-accent; font-size: 1.5rem; color: $navy; }
  }
  &__note { font-size: 0.82rem; color: $text-secondary; text-align: center; margin-top: 0.3rem; }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
  span { font-size: 0.85rem; font-weight: 600; color: $text; }
  input, textarea {
    border: 1.5px solid $border-strong;
    border-radius: 12px;
    padding: 0.75rem 0.9rem;
    background: $white;
    color: $text;
    transition: border-color 0.15s ease;
    &:focus { outline: none; border-color: $cyan; }
  }
  textarea { resize: vertical; }
}
.field-row { display: flex; flex-wrap: wrap; gap: 1rem; }
</style>
