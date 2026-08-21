<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ordersService } from '@/services/orders.service'
import { formatPrice, formatDate } from '@/composables/useFormat'
import type { Order } from '@/types'

const orders = ref<Order[]>([])
const loading = ref(true)

const statusLabel: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  processing: 'En proceso',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

onMounted(async () => {
  try {
    orders.value = await ordersService.mine()
  } catch {
    orders.value = []
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="orders">
    <header class="orders__head">
      <div>
        <h1>Mis pedidos</h1>
        <p>Historial y estado de tus compras</p>
      </div>
      <RouterLink to="/cuenta" class="btn btn--ghost btn--sm">← Mi cuenta</RouterLink>
    </header>

    <div v-if="loading" class="orders__loading">Cargando…</div>

    <div v-else-if="!orders.length" class="orders__empty">
      <h3>Aún no tienes pedidos</h3>
      <RouterLink to="/tienda" class="btn btn--primary">Explorar la tienda</RouterLink>
    </div>

    <div v-else class="orders__list">
      <article v-for="o in orders" :key="o._id" class="orders__card">
        <div class="orders__card-top">
          <div>
            <strong class="orders__num">{{ o.orderNumber }}</strong>
            <span class="orders__date">{{ formatDate(o.createdAt) }}</span>
          </div>
          <span class="chip" :class="`status status--${o.status}`">{{ statusLabel[o.status] }}</span>
        </div>
        <ul class="orders__items">
          <li v-for="item in o.items" :key="item.name">{{ item.quantity }}× {{ item.name }}</li>
        </ul>
        <div class="orders__card-foot">
          <span>Total</span>
          <strong>{{ formatPrice(o.total, o.currency) }}</strong>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped lang="scss">
.orders {
  @include container;
  padding-block: 2.5rem 4rem;

  &__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.8rem;
    h1 { font-size: clamp(1.6rem, 3.5vw, 2.3rem); }
    p { color: $text-secondary; }
  }

  &__loading, &__empty {
    text-align: center;
    padding: 3.5rem 1rem;
    color: $text-secondary;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  &__list { display: flex; flex-direction: column; gap: 1.1rem; }
  &__card { @include card; padding: 1.4rem 1.6rem; display: flex; flex-direction: column; gap: 0.9rem; }
  &__card-top { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }
  &__num { font-family: $font-accent; color: $navy; }
  &__date { display: block; color: $text-secondary; font-size: 0.82rem; }
  &__items { display: flex; flex-direction: column; gap: 0.25rem; color: $text-secondary; font-size: 0.9rem; }
  &__card-foot {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding-top: 0.8rem;
    border-top: 1px solid $border;
    strong { font-family: $font-accent; font-size: 1.3rem; color: $navy; }
  }
}

.status {
  &--pending { background: rgba(245, 158, 11, 0.14); color: darken($warning, 8%); }
  &--confirmed, &--processing { background: rgba(59, 130, 246, 0.14); color: $info; }
  &--shipped { background: rgba(33, 188, 251, 0.14); color: $cyan-strong; }
  &--delivered { background: rgba(16, 185, 129, 0.14); color: $success; }
  &--cancelled { background: rgba(239, 68, 68, 0.12); color: $error; }
}
</style>
