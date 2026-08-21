<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { formatPrice } from '@/composables/useFormat'
import type { Product } from '@/types'
import ProductImage from '@/components/ProductImage.vue'

const toast = useToastStore()
const products = ref<Product[]>([])
const loading = ref(true)
const search = ref('')

async function load() {
  loading.value = true
  try {
    products.value = (await adminService.listProducts(search.value)).data
  } catch {
    products.value = []
  } finally {
    loading.value = false
  }
}

let timer: number
function onSearch() {
  clearTimeout(timer)
  timer = window.setTimeout(load, 300)
}

async function remove(p: Product) {
  if (!confirm(`¿Eliminar "${p.name}"?`)) return
  try {
    await adminService.deleteProduct(p._id)
    products.value = products.value.filter((x) => x._id !== p._id)
    toast.success('Producto eliminado')
  } catch {
    toast.error('No se pudo eliminar')
  }
}

onMounted(load)
</script>

<template>
  <div class="ap">
    <header class="ap__head">
      <div>
        <h1>Productos</h1>
        <p>{{ products.length }} productos en catálogo</p>
      </div>
      <RouterLink to="/admin/productos/nuevo" class="btn btn--primary">+ Nuevo producto</RouterLink>
    </header>

    <div class="ap__search">
      <input v-model="search" @input="onSearch" type="search" placeholder="Buscar por nombre o modelo…" />
    </div>

    <div v-if="loading" class="ap__muted">Cargando…</div>
    <div v-else-if="!products.length" class="ap__muted">No hay productos. Crea el primero.</div>

    <div v-else class="ap__list">
      <article v-for="p in products" :key="p._id" class="ap__row">
        <div class="ap__thumb"><ProductImage :src="p.images?.[0]" :label="p.modelCode" /></div>
        <div class="ap__info">
          <strong>{{ p.name }}</strong>
          <span class="ap__model">{{ p.modelCode }}</span>
        </div>
        <div class="ap__meta">
          <span class="ap__price">{{ formatPrice(p.price, p.currency) }}</span>
          <span class="ap__stock" :class="{ low: p.stock <= 3 }">Stock: {{ p.stock }}</span>
        </div>
        <div class="ap__flags">
          <span v-if="p.featured" class="chip chip--gold">Destacado</span>
          <span v-if="!p.isActive" class="chip">Inactivo</span>
        </div>
        <div class="ap__actions">
          <RouterLink :to="`/admin/productos/${p._id}`" class="btn btn--ghost btn--sm">Editar</RouterLink>
          <button class="ap__del" @click="remove(p)" aria-label="Eliminar">🗑</button>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ap {
  display: flex;
  flex-direction: column;
  gap: 1.3rem;

  &__head { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; h1 { font-size: 1.6rem; } p { color: $text-secondary; } }

  &__search input {
    width: 100%;
    max-width: 380px;
    border: 1.5px solid $border-strong;
    border-radius: 999px;
    padding: 0.7rem 1.1rem;
    background: $white;
    &:focus { outline: none; border-color: $cyan; }
  }

  &__muted { color: $text-secondary; padding: 2rem; text-align: center; }

  &__list { display: flex; flex-direction: column; gap: 0.7rem; }
  &__row {
    display: flex;
    align-items: center;
    gap: 1rem;
    @include card;
    padding: 0.8rem 1rem;
    flex-wrap: wrap;
  }
  &__thumb { width: 58px; height: 58px; border-radius: 12px; overflow: hidden; flex-shrink: 0; }
  &__info { flex: 1 1 160px; display: flex; flex-direction: column; strong { font-family: $font-principal; } }
  &__model { font-size: 0.78rem; color: $cyan-strong; text-transform: uppercase; letter-spacing: 0.05em; }
  &__meta { display: flex; flex-direction: column; align-items: flex-end; }
  &__price { font-family: $font-accent; font-weight: 700; color: $navy; }
  &__stock { font-size: 0.8rem; color: $text-secondary; &.low { color: $warning; } }
  &__flags { display: flex; gap: 0.3rem; }
  &__actions { display: flex; align-items: center; gap: 0.5rem; }
  &__del { width: 38px; height: 38px; border-radius: 10px; &:hover { background: rgba(239, 68, 68, 0.1); } }
}
</style>
