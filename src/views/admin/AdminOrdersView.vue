<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { formatPrice, formatDate } from '@/composables/useFormat'
import type { Order, OrderStatus } from '@/types'

const toast = useToastStore()
const orders = ref<Order[]>([])
const loading = ref(true)
const statusFilter = ref('')
const expanded = ref<string | null>(null)

const statuses: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'processing', label: 'En proceso' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'delivered', label: 'Entregado' },
  { value: 'cancelled', label: 'Cancelado' },
]

async function load() {
  loading.value = true
  try {
    orders.value = (await adminService.listOrders({ status: statusFilter.value })).data
  } catch {
    orders.value = []
  } finally {
    loading.value = false
  }
}

async function changeStatus(order: Order, status: OrderStatus) {
  try {
    await adminService.updateOrderStatus(order._id, status)
    order.status = status
    toast.success('Estado actualizado')
  } catch {
    toast.error('No se pudo actualizar')
  }
}

function toggle(id: string) {
  expanded.value = expanded.value === id ? null : id
}

onMounted(load)
</script>

<template>
  <div class="ao">
    <header class="ao__head">
      <h1>Pedidos</h1>
      <select v-model="statusFilter" @change="load" class="ao__filter">
        <option value="">Todos los estados</option>
        <option v-for="s in statuses" :key="s.value" :value="s.value">{{ s.label }}</option>
      </select>
    </header>

    <div v-if="loading" class="ao__muted">Cargando…</div>
    <div v-else-if="!orders.length" class="ao__muted">No hay pedidos.</div>

    <div v-else class="ao__list">
      <article v-for="o in orders" :key="o._id" class="ao__card">
        <div class="ao__row" @click="toggle(o._id)">
          <div class="ao__cell ao__num">{{ o.orderNumber }}</div>
          <div class="ao__cell">
            <strong>{{ o.customer.name }}</strong>
            <small>{{ o.customer.email }}</small>
          </div>
          <div class="ao__cell ao__date">{{ formatDate(o.createdAt) }}</div>
          <div class="ao__cell ao__total">{{ formatPrice(o.total, o.currency) }}</div>
          <select
            class="ao__status"
            :class="`status--${o.status}`"
            :value="o.status"
            @click.stop
            @change="changeStatus(o, ($event.target as HTMLSelectElement).value as OrderStatus)"
          >
            <option v-for="s in statuses" :key="s.value" :value="s.value">{{ s.label }}</option>
          </select>
        </div>

        <div v-if="expanded === o._id" class="ao__detail">
          <div class="ao__detail-col">
            <h4>Productos</h4>
            <ul>
              <li v-for="item in o.items" :key="item.name">
                <span>{{ item.quantity }}× {{ item.name }}</span>
                <span>{{ formatPrice(item.price * item.quantity, o.currency) }}</span>
              </li>
            </ul>
          </div>
          <div class="ao__detail-col">
            <h4>Cliente</h4>
            <p>{{ o.customer.name }}</p>
            <p>{{ o.customer.email }}</p>
            <p v-if="o.customer.phone">{{ o.customer.phone }}</p>
            <p v-if="o.customer.address">{{ o.customer.address }}, {{ o.customer.city }}</p>
            <p v-if="o.customer.notes" class="ao__notes">“{{ o.customer.notes }}”</p>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ao {
  display: flex;
  flex-direction: column;
  gap: 1.3rem;

  &__head { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; h1 { font-size: 1.6rem; } }
  &__filter { border: 1.5px solid $border-strong; border-radius: 999px; padding: 0.6rem 1.1rem; background: $white; }
  &__muted { color: $text-secondary; padding: 2rem; text-align: center; @include card; }

  &__list { display: flex; flex-direction: column; gap: 0.7rem; }
  &__card { @include card; overflow: hidden; }
  &__row {
    display: flex;
    align-items: center;
    gap: 0.8rem 1rem;
    padding: 1rem 1.2rem;
    cursor: pointer;
    flex-wrap: wrap;
    &:hover { background: $surface; }
  }
  &__cell { display: flex; flex-direction: column; small { color: $text-secondary; font-size: 0.78rem; } }
  &__num { font-family: $font-accent; color: $cyan-strong; flex: 1 1 130px; }
  &__date { color: $text-secondary; font-size: 0.85rem; }
  &__total { font-family: $font-accent; font-weight: 700; color: $navy; margin-left: auto; }

  &__status {
    border: none;
    border-radius: 999px;
    padding: 0.45rem 0.9rem;
    font-family: $font-accent;
    font-weight: 600;
    font-size: 0.8rem;
    cursor: pointer;
    &.status--pending { background: rgba(245,158,11,0.16); color: darken($warning, 8%); }
    &.status--confirmed, &.status--processing { background: rgba(59,130,246,0.16); color: $info; }
    &.status--shipped { background: rgba(33,188,251,0.16); color: $cyan-strong; }
    &.status--delivered { background: rgba(16,185,129,0.16); color: $success; }
    &.status--cancelled { background: rgba(239,68,68,0.14); color: $error; }
  }

  &__detail {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    padding: 1.2rem 1.2rem 1.5rem;
    border-top: 1px solid $border;
    background: $surface;
    h4 { margin-bottom: 0.6rem; font-size: 0.95rem; }
  }
  &__detail-col { flex: 1 1 220px; ul { display: flex; flex-direction: column; gap: 0.4rem; } li { display: flex; justify-content: space-between; gap: 1rem; font-size: 0.9rem; } p { color: $text-secondary; font-size: 0.9rem; } }
  &__notes { font-style: italic; margin-top: 0.4rem; }
}
</style>
