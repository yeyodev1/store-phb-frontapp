<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { catalogService } from '@/services/catalog.service'
import type { Product } from '@/types'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { formatPrice } from '@/composables/useFormat'
import { site } from '@/config/site'
import {
  THEME_LABELS,
  canAddToCart,
  getCtaLabel,
  getGateTarget,
  isExternalUrl,
  isLeadMagnet,
  isPriceOnRequest,
  isPhysical,
  requiresGate,
  showsPrice,
} from '@/utils/product'
import ProductImage from '@/components/ProductImage.vue'
import ProductCard from '@/components/ProductCard.vue'
import QuantityStepper from '@/components/QuantityStepper.vue'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()
const toast = useToastStore()

const product = ref<Product | null>(null)
const related = ref<Product[]>([])
const qty = ref(1)
const loading = ref(true)
const notFound = ref(false)

const purchasable = computed(() => (product.value ? canAddToCart(product.value) : false))
const priceVisible = computed(() => (product.value ? showsPrice(product.value) : false))
const ctaLabel = computed(() => (product.value ? getCtaLabel(product.value) : ''))
const isClinical = computed(() => product.value?.productType === 'clinical')
const gated = computed(() => (product.value ? requiresGate(product.value) : false))
const gateTarget = computed(() => (product.value ? getGateTarget(product.value) : '/tienda'))
const gateIsExternal = computed(() => isExternalUrl(gateTarget.value))

const highlights = computed(() => {
  if (!product.value) return []
  const p = product.value
  return [
    { key: 'format', label: 'Qué es', value: p.format },
    { key: 'whatYouLearn', label: 'Qué aprenderás', value: p.whatYouLearn },
    { key: 'idealFor', label: 'Ideal para ti si', value: p.idealFor },
    { key: 'timeRequired', label: 'Cuánto tiempo necesitas', value: p.timeRequired },
  ].filter((h) => !!h.value)
})

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
  const ok = cart.add(product.value, qty.value)
  if (!ok) {
    toast.error('Este producto no se agrega al carrito.')
    return
  }
  toast.success(`${product.value.name} agregado al carrito`)
}

function onGateCta() {
  if (!product.value) return
  if (gateIsExternal.value) {
    window.open(gateTarget.value, '_blank', 'noopener')
    return
  }
  router.push(gateTarget.value)
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
            <span>{{ product.modelCode || product.name }}</span>
          </nav>

          <ul v-if="product.themes?.length" class="pdp__themes">
            <li v-for="t in product.themes" :key="t" class="chip chip--cyan">{{ THEME_LABELS[t] }}</li>
          </ul>

          <h1 class="pdp__title">{{ product.name }}</h1>
          <p class="pdp__short">{{ product.shortDescription }}</p>

          <ul v-if="highlights.length" class="pdp__highlights">
            <li v-for="h in highlights" :key="h.key">
              <span class="pdp__highlight-label">{{ h.label }}</span>
              <span class="pdp__highlight-value">{{ h.value }}</span>
            </li>
          </ul>

          <div v-if="priceVisible" class="pdp__price">
            <span class="pdp__amount">{{ formatPrice(product.price, product.currency) }}</span>
            <span v-if="product.compareAtPrice && product.compareAtPrice > product.price" class="pdp__compare">
              {{ formatPrice(product.compareAtPrice, product.currency) }}
            </span>
          </div>
          <div v-else-if="isPriceOnRequest(product)" class="pdp__price">
            <span class="pdp__amount pdp__amount--tbd">Precio a confirmar</span>
          </div>

          <div v-else-if="isLeadMagnet(product)" class="pdp__price">
            <span class="pdp__amount pdp__amount--free">Gratis</span>
          </div>

          <div v-if="isPhysical(product)" class="pdp__stock" :class="{ out: product.stock <= 0 }">
            <span class="dot" />
            {{ product.stock > 0 ? 'Disponible · envío coordinado' : 'Bajo pedido' }}
          </div>

          <!-- Compra normal -->
          <template v-if="purchasable">
            <div class="pdp__buy">
              <QuantityStepper v-model="qty" :max="Math.max(1, isPhysical(product) ? product.stock || 10 : 99)" />
              <button class="btn btn--primary btn--lg pdp__add" @click="addToCart">{{ ctaLabel }}</button>
            </div>

            <a
              v-if="isPhysical(product)"
              :href="`https://wa.me/${site.contact.whatsapp}?text=Hola,%20me%20interesa%20el%20${encodeURIComponent(product.name)}`"
              class="btn btn--gold btn--block"
              target="_blank"
              rel="noopener"
            >
              Comprar con asesoría por WhatsApp
            </a>
          </template>

          <!-- Producto gated: clínico / requiere evaluación, o lead magnet -->
          <template v-else>
            <div class="pdp__gate">
              <p v-if="gated" class="pdp__gate-notice">
                Este producto no se compra directamente: requiere evaluación previa.
              </p>
              <p v-if="isClinical" class="pdp__gate-notice">
                Toda intervención clínica requiere evaluación previa e indicación de un profesional de la salud.
              </p>
              <p v-else-if="isLeadMagnet(product)" class="pdp__gate-notice">
                Este recurso es gratuito y no requiere pago.
              </p>
              <button v-if="isLeadMagnet(product)" class="btn btn--primary btn--lg pdp__add" @click="addToCart">
                {{ ctaLabel }}
              </button>
              <button v-else class="btn btn--primary btn--lg pdp__add" @click="onGateCta">
                {{ ctaLabel }}
              </button>
            </div>
          </template>

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

        <section v-if="isPhysical(product) && product.specs?.length" class="pdp__specs">
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

  &__themes {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__title { font-size: clamp(1.8rem, 4vw, 2.6rem); }
  &__short { color: $text-secondary; font-size: 1.05rem; }

  &__highlights {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    width: 100%;
    background: $surface-2;
    border-radius: 18px;
    padding: 1.1rem 1.3rem;

    li {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }
  }

  &__highlight-label {
    font-family: $font-accent;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: $cyan-strong;
  }

  &__highlight-value {
    color: $text;
    font-size: 0.95rem;
  }

  &__price {
    display: flex;
    align-items: baseline;
    gap: 0.8rem;
  }
  &__amount {
    font-family: $font-accent;
    font-weight: 700;
    font-size: 2.2rem;
    color: $navy;

    &--free { color: $success; }

    // Precio que el negocio todavía no define.
    &--tbd {
      font-size: 1.05rem;
      font-weight: 600;
      color: $text-secondary;
    }
  }
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

  &__gate {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    margin-top: 0.4rem;
    padding: 1.1rem 1.3rem;
    border-radius: 18px;
    border: 1.5px dashed $border-strong;
    background: $surface-2;
  }

  &__gate-notice {
    color: $text-secondary;
    font-size: 0.92rem;
  }

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
    > * { flex: 1 1 220px; max-width: 100%; }

    @include sm { > * { max-width: calc(50% - 0.7rem); } }
    @include lg { > * { max-width: calc(25% - 1.05rem); } }
  }
}
</style>
