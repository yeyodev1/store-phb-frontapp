<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { adminService, type AdminStats } from '@/services/admin.service'
import { formatPrice, formatDate } from '@/composables/useFormat'
import type { Order } from '@/types'

const stats = ref<AdminStats | null>(null)
const recent = ref<Order[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [s, o] = await Promise.all([
      adminService.stats(),
      adminService.listOrders(),
    ])
    stats.value = s
    recent.value = o.data.slice(0, 6)
  } catch {
    // ignore
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="dash">
    <header class="dash__head">
      <h1>Dashboard</h1>
      <p>Resumen de tu tienda Agua Kangen</p>
    </header>

    <div class="dash__stats">
      <div class="dash__stat">
        <span class="dash__stat-label">Pedidos totales</span>
        <strong>{{ stats?.totalOrders ?? '—' }}</strong>
      </div>
      <div class="dash__stat dash__stat--warn">
        <span class="dash__stat-label">Pendientes</span>
        <strong>{{ stats?.pendingOrders ?? '—' }}</strong>
      </div>
      <div class="dash__stat dash__stat--accent">
        <span class="dash__stat-label">Ingresos</span>
        <strong>{{ stats ? formatPrice(stats.revenue) : '—' }}</strong>
      </div>
    </div>

    <div class="dash__quick">
      <RouterLink to="/admin/productos/nuevo" class="dash__quick-btn">+ Nuevo producto</RouterLink>
      <RouterLink to="/admin/pedidos" class="dash__quick-btn">Ver pedidos</RouterLink>
      <RouterLink to="/admin/usuarios" class="dash__quick-btn">Gestionar usuarios</RouterLink>
    </div>

    <section class="dash__recent">
      <div class="dash__recent-head">
        <h2>Pedidos recientes</h2>
        <RouterLink to="/admin/pedidos" class="dash__link">Ver todos →</RouterLink>
      </div>

      <div v-if="loading" class="dash__muted">Cargando…</div>
      <div v-else-if="!recent.length" class="dash__muted">Sin pedidos todavía.</div>
      <div v-else class="dash__table">
        <div v-for="o in recent" :key="o._id" class="dash__row">
          <span class="dash__cell dash__num">{{ o.orderNumber }}</span>
          <span class="dash__cell">{{ o.customer.name }}</span>
          <span class="dash__cell dash__muted">{{ formatDate(o.createdAt) }}</span>
          <span class="dash__cell dash__amount">{{ formatPrice(o.total, o.currency) }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.dash {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;

  &__head h1 { font-size: 1.7rem; }
  &__head p { color: $text-secondary; }

  &__stats { display: flex; flex-wrap: wrap; gap: 1.1rem; }
  &__stat {
    flex: 1 1 180px;
    @include card;
    padding: 1.4rem 1.6rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    strong { font-family: $font-accent; font-size: 2rem; color: $navy; }
    &--warn strong { color: $warning; }
    &--accent { background: $grad-navy; strong { color: $accent; } .dash__stat-label { color: $text-on-navy; } }
  }
  &__stat-label { font-size: 0.85rem; color: $text-secondary; }

  &__quick { display: flex; flex-wrap: wrap; gap: 0.7rem; }
  &__quick-btn {
    padding: 0.7rem 1.2rem;
    border-radius: 999px;
    background: $white;
    border: 1.5px solid $border-strong;
    font-family: $font-accent;
    font-weight: 600;
    font-size: 0.9rem;
    color: $navy;
    &:hover { border-color: $cyan; color: $cyan-strong; }
  }

  &__recent { @include card; padding: 1.6rem; }
  &__recent-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; h2 { font-size: 1.2rem; } }
  &__link { color: $cyan-strong; font-family: $font-accent; font-weight: 600; font-size: 0.9rem; }

  &__table { display: flex; flex-direction: column; }
  &__row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
    align-items: center;
    padding: 0.85rem 0;
    border-bottom: 1px solid $border;
    &:last-child { border-bottom: none; }
  }
  &__cell { font-size: 0.9rem; }
  &__num { font-family: $font-accent; color: $cyan-strong; flex: 1 1 140px; }
  &__amount { margin-left: auto; font-family: $font-accent; font-weight: 700; color: $navy; }
  &__muted { color: $text-secondary; }
}
</style>
