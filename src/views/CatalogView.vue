<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { catalogService } from '@/services/catalog.service'
import type { Product, Category } from '@/types'
import ProductCard from '@/components/ProductCard.vue'

const route = useRoute()
const router = useRouter()

const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const loading = ref(true)
const search = ref((route.query.search as string) || '')
const activeCategory = ref((route.query.category as string) || '')
const sort = ref('-createdAt')

const sorts = [
  { value: '-createdAt', label: 'Novedades' },
  { value: 'price', label: 'Precio: menor a mayor' },
  { value: '-price', label: 'Precio: mayor a menor' },
  { value: 'name', label: 'Nombre A–Z' },
]

async function load() {
  loading.value = true
  try {
    products.value = (
      await catalogService.listProducts({
        search: search.value,
        category: activeCategory.value,
        sort: sort.value,
        limit: 48,
      })
    ).data
  } catch {
    products.value = []
  } finally {
    loading.value = false
  }
}

function setCategory(slug: string) {
  activeCategory.value = activeCategory.value === slug ? '' : slug
  router.replace({ query: { ...(activeCategory.value ? { category: activeCategory.value } : {}) } })
}

let timer: number
function onSearch() {
  clearTimeout(timer)
  timer = window.setTimeout(load, 300)
}

watch(() => route.query.category, (c) => {
  activeCategory.value = (c as string) || ''
  load()
})
watch(sort, load)

onMounted(async () => {
  categories.value = await catalogService.listCategories().catch(() => [])
  await load()
})
</script>

<template>
  <div class="catalog">
    <header class="catalog__hero">
      <div class="catalog__hero-inner">
        <span class="eyebrow">Tienda oficial</span>
        <h1>Ionizadores y equipos Kangen</h1>
        <p>Equipos originales Enagic con garantía oficial y asesoría personalizada.</p>
      </div>
    </header>

    <div class="catalog__body">
      <div class="catalog__toolbar">
        <div class="catalog__search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" stroke-linecap="round" /></svg>
          <input v-model="search" @input="onSearch" type="search" placeholder="Buscar producto o modelo..." />
        </div>
        <select v-model="sort" class="catalog__sort">
          <option v-for="s in sorts" :key="s.value" :value="s.value">{{ s.label }}</option>
        </select>
      </div>

      <div class="catalog__chips">
        <button class="chip" :class="{ 'chip--cyan': !activeCategory }" @click="setCategory('')">Todos</button>
        <button
          v-for="c in categories"
          :key="c._id"
          class="chip"
          :class="{ 'chip--cyan': activeCategory === c.slug }"
          @click="setCategory(c.slug)"
        >
          {{ c.name }}
        </button>
      </div>

      <div v-if="loading" class="catalog__grid">
        <div v-for="n in 6" :key="n" class="skeleton" />
      </div>
      <div v-else-if="products.length" class="catalog__grid">
        <ProductCard v-for="p in products" :key="p._id" :product="p" />
      </div>
      <div v-else class="catalog__empty">
        <h3>Sin resultados</h3>
        <p>No encontramos productos con esos filtros.</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.catalog {
  &__hero {
    background: $grad-navy;
    color: $white;
  }
  &__hero-inner {
    @include container;
    padding-block: clamp(2.5rem, 6vw, 4rem);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    h1 { color: $white; font-size: clamp(1.9rem, 4vw, 3rem); }
    p { color: $text-on-navy; max-width: 50ch; }
  }

  &__body { @include container; padding-block: 2.2rem; }

  &__toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    margin-bottom: 1.2rem;
  }

  &__search {
    flex: 1 1 260px;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: $white;
    border: 1.5px solid $border-strong;
    border-radius: 999px;
    padding: 0.2rem 1rem;
    svg { width: 20px; height: 20px; color: $text-secondary; flex-shrink: 0; }
    input { flex: 1; border: none; outline: none; padding: 0.7rem 0; background: transparent; }
  }

  &__sort {
    border: 1.5px solid $border-strong;
    border-radius: 999px;
    padding: 0.7rem 1.1rem;
    background: $white;
    color: $text;
    cursor: pointer;
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.8rem;
    .chip { cursor: pointer; border: none; }
  }

  &__grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1.4rem;
    > * { flex: 1 1 240px; max-width: calc(33.333% - 0.94rem); }

    @include until-lg { > * { max-width: calc(50% - 0.7rem); } }
    @include until-md { > * { max-width: 100%; } }
  }

  &__empty {
    text-align: center;
    padding: 4rem 1rem;
    color: $text-secondary;
    h3 { margin-bottom: 0.4rem; }
  }
}

.skeleton {
  height: 360px;
  border-radius: 22px;
  background: linear-gradient(100deg, $surface-2 30%, $surface-3 50%, $surface-2 70%);
  background-size: 200% 100%;
  animation: shimmer 1.3s infinite;
}
@keyframes shimmer { to { background-position: -200% 0; } }
</style>
