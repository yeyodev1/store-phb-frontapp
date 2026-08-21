<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { catalogService } from '@/services/catalog.service'
import type { Product } from '@/types'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { formatPrice } from '@/composables/useFormat'
import { site } from '@/config/site'
import ProductImage from '@/components/ProductImage.vue'
import ProductCard from '@/components/ProductCard.vue'
import QuantityStepper from '@/components/QuantityStepper.vue'

const route = useRoute()
const cart = useCartStore()
const toast = useToastStore()

const product = ref<Product | null>(null)
const related = ref<Product[]>([])
const qty = ref(1)
const loading = ref(true)
const notFound = ref(false)

async function load(slug: string) {
  loading.value = true
  notFound.value = false
  qty.value = 1
  try {
    const res = await catalogService.getProduct(slug)
    product.value = res.data
    related.value = res.related
  } catch {
    notFound.value = true
  } finally {
    loading.value = false
  }
}

function addToCart() {
  if (!product.value) return
  cart.add(product.value, qty.value)
  toast.success(`${product.value.name} agregado al carrito`)
}

onMounted(() => load(route.params.slug as string))
watch(() => route.params.slug, (s) => s && load(s as string))
</script>

<template>
  <div class="pdp">
    <div v-if="loading" class="pdp__loading">Cargando…</div>

    <div v-else-if="notFound" class="pdp__notfound">
      <h2>Producto no encontrado</h2>
      <RouterLink to="/tienda" class="btn btn--primary">Volver a la tienda</RouterLink>
    </div>

    <template v-else-if="product">
      <div class="pdp__top">
        <div class="pdp__gallery">
          <div class="pdp__main">
            <ProductImage :src="product.images?.[0]" :label="product.modelCode" :alt="product.name" ratio="4 / 5" />
          </div>
        </div>

        <div class="pdp__info">
          <nav class="pdp__crumbs">
            <RouterLink to="/tienda">Tienda</RouterLink>
            <span>/</span>
            <span>{{ product.modelCode }}</span>
          </nav>

          <h1 class="pdp__title">{{ product.name }}</h1>
          <p class="pdp__short">{{ product.shortDescription }}</p>

          <div class="pdp__price">
            <span class="pdp__amount">{{ formatPrice(product.price, product.currency) }}</span>
            <span v-if="product.compareAtPrice && product.compareAtPrice > product.price" class="pdp__compare">
              {{ formatPrice(product.compareAtPrice, product.currency) }}
            </span>
          </div>

          <div class="pdp__stock" :class="{ out: product.stock <= 0 }">
            <span class="dot" />
            {{ product.stock > 0 ? 'Disponible · envío coordinado' : 'Bajo pedido' }}
          </div>

          <div class="pdp__buy">
            <QuantityStepper v-model="qty" :max="Math.max(1, product.stock || 10)" />
            <button class="btn btn--primary btn--lg pdp__add" @click="addToCart">Agregar al carrito</button>
          </div>

          <a :href="`https://wa.me/${site.contact.whatsapp}?text=Hola,%20me%20interesa%20el%20${encodeURIComponent(product.name)}`"
             class="btn btn--gold btn--block" target="_blank" rel="noopener">
            Comprar con asesoría por WhatsApp
          </a>

          <ul v-if="product.benefits?.length" class="pdp__benefits">
            <li v-for="b in product.benefits" :key="b">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" /></svg>
              {{ b }}
            </li>
          </ul>
        </div>
      </div>

      <div class="pdp__details">
        <section v-if="product.description" class="pdp__desc">
          <h2>Descripción</h2>
          <p>{{ product.description }}</p>
        </section>

        <section v-if="product.specs?.length" class="pdp__specs">
          <h2>Especificaciones</h2>
          <dl>
            <div v-for="s in product.specs" :key="s.label">
              <dt>{{ s.label }}</dt>
              <dd>{{ s.value }}</dd>
            </div>
          </dl>
        </section>
      </div>

      <section v-if="related.length" class="pdp__related">
        <h2>También te puede interesar</h2>
        <div class="pdp__related-grid">
          <ProductCard v-for="r in related" :key="r._id" :product="r" />
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped lang="scss">
.pdp {
  @include container;
  padding-block: 2.2rem 3.5rem;

  &__loading, &__notfound {
    text-align: center;
    padding: 5rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;
    color: $text-secondary;
  }

  &__top {
    display: flex;
    flex-wrap: wrap;
    gap: 2.5rem;
    align-items: flex-start;
  }

  &__gallery { flex: 1 1 360px; position: sticky; top: 90px; }
  &__main { border-radius: 26px; overflow: hidden; border: 1px solid $border; box-shadow: $shadow-sm; }

  &__info {
    flex: 1 1 380px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  &__crumbs {
    display: flex;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: $text-secondary;
    a:hover { color: $cyan-strong; }
  }

  &__title { font-size: clamp(1.8rem, 4vw, 2.6rem); }
  &__short { color: $text-secondary; font-size: 1.05rem; }

  &__price {
    display: flex;
    align-items: baseline;
    gap: 0.8rem;
  }
  &__amount { font-family: $font-accent; font-weight: 700; font-size: 2.2rem; color: $navy; }
  &__compare { color: $text-secondary; text-decoration: line-through; font-size: 1.1rem; }

  &__stock {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: $success;
    .dot { width: 9px; height: 9px; border-radius: 50%; background: $success; }
    &.out { color: $warning; .dot { background: $warning; } }
  }

  &__buy {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    width: 100%;
    margin-top: 0.4rem;
  }
  &__add { flex: 1; }

  &__benefits {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    margin-top: 0.8rem;
    li {
      display: flex;
      align-items: flex-start;
      gap: 0.6rem;
      color: $text;
      svg { width: 20px; height: 20px; color: $success; flex-shrink: 0; margin-top: 2px; }
    }
  }

  &__details {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    margin-top: 3rem;
    padding-top: 2.5rem;
    border-top: 1px solid $border;
    > section { flex: 1 1 320px; }
    h2 { font-size: 1.3rem; margin-bottom: 1rem; }
    p { color: $text-secondary; }
  }

  &__specs dl { display: flex; flex-direction: column; gap: 0.1rem; }
  &__specs div {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid $border;
    dt { color: $text-secondary; }
    dd { font-weight: 600; text-align: right; }
  }

  &__related { margin-top: 3.5rem; h2 { margin-bottom: 1.5rem; } }
  &__related-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1.4rem;
    > * { flex: 1 1 220px; max-width: calc(25% - 1.05rem); }
    @include until-lg { > * { max-width: calc(50% - 0.7rem); } }
    @include until-md { > * { max-width: 100%; } }
  }
}
</style>
