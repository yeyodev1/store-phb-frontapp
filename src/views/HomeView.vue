<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { catalogService } from '@/services/catalog.service'
import type { Product, Category } from '@/types'
import { site, waterTypes, trustBadges } from '@/config/site'
import ProductCard from '@/components/ProductCard.vue'

const featured = ref<Product[]>([])
const categories = ref<Category[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [f, c] = await Promise.all([
      catalogService.listProducts({ featured: true, limit: 4 }),
      catalogService.listCategories(),
    ])
    featured.value = f.data
    categories.value = c
  } catch {
    // API may be offline during first setup — page still renders.
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="home">
    <!-- Hero -->
    <section class="hero">
      <div class="hero__inner">
        <div class="hero__copy">
          <span class="chip chip--gold">Distribuidor oficial Enagic®</span>
          <h1 class="hero__title">
            {{ site.tagline }}
          </h1>
          <p class="hero__lead">
            Ionizadores Kangen que transforman el agua del grifo en agua alcalina rica en
            hidrógeno: antioxidante, micro-agrupada y con tecnología médica japonesa.
          </p>
          <div class="hero__cta">
            <RouterLink to="/tienda" class="btn btn--primary btn--lg">Ver ionizadores</RouterLink>
            <RouterLink to="/beneficios" class="btn btn--light btn--lg">Conoce los beneficios</RouterLink>
          </div>
          <ul class="hero__badges">
            <li v-for="b in trustBadges" :key="b">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" /></svg>
              {{ b }}
            </li>
          </ul>
        </div>

        <div class="hero__visual">
          <div class="hero__drop">
            <svg viewBox="0 0 200 250" aria-hidden="true">
              <defs>
                <linearGradient id="hd" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#2094D2" />
                  <stop offset="55%" stop-color="#21BCFB" />
                  <stop offset="100%" stop-color="#18E7F0" />
                </linearGradient>
              </defs>
              <path d="M100 12 C100 12 180 108 180 165 A80 80 0 0 1 20 165 C20 108 100 12 100 12 Z" fill="url(#hd)" />
              <ellipse cx="72" cy="155" rx="22" ry="32" fill="rgba(255,255,255,0.4)" />
            </svg>
          </div>
          <div class="hero__ph">
            <span>pH 9.5</span>
            <small>Alcalina Kangen</small>
          </div>
        </div>
      </div>
    </section>

    <!-- Water types -->
    <section class="section water">
      <div class="water__head">
        <span class="eyebrow">Un solo equipo, 5 tipos de agua</span>
        <h2>El agua correcta para cada momento</h2>
      </div>
      <div class="water__strip">
        <article v-for="w in waterTypes" :key="w.name" class="water__card">
          <span class="water__ph" :style="{ background: w.tone }">{{ w.ph }}</span>
          <strong>{{ w.name }}</strong>
          <p>{{ w.use }}</p>
          <span class="water__tag" :class="w.potable ? 'chip chip--stock' : 'chip'">
            {{ w.potable ? 'Potable' : 'Uso externo' }}
          </span>
        </article>
      </div>
    </section>

    <!-- Featured -->
    <section class="section featured">
      <div class="featured__head">
        <div>
          <span class="eyebrow">Los más elegidos</span>
          <h2>Ionizadores destacados</h2>
        </div>
        <RouterLink to="/tienda" class="btn btn--ghost">Ver todo</RouterLink>
      </div>

      <div v-if="loading" class="featured__grid">
        <div v-for="n in 4" :key="n" class="skeleton" />
      </div>
      <div v-else-if="featured.length" class="featured__grid">
        <ProductCard v-for="p in featured" :key="p._id" :product="p" />
      </div>
      <p v-else class="featured__empty">
        Aún no hay productos cargados. Ejecuta el seed del backend o agrégalos desde el panel de administración.
      </p>
    </section>

    <!-- Categories -->
    <section v-if="categories.length" class="section cats">
      <div class="cats__strip">
        <RouterLink
          v-for="c in categories"
          :key="c._id"
          :to="`/tienda?category=${c.slug}`"
          class="cats__card"
        >
          <h3>{{ c.name }}</h3>
          <p>{{ c.description }}</p>
          <span class="cats__go">Explorar →</span>
        </RouterLink>
      </div>
    </section>

    <!-- CTA band -->
    <section class="cta-band">
      <div class="cta-band__inner">
        <div>
          <h2>¿No sabes qué modelo elegir?</h2>
          <p>Te asesoramos según tu familia, tu consumo y tu presupuesto.</p>
        </div>
        <a :href="`https://wa.me/${site.contact.whatsapp}`" class="btn btn--gold btn--lg" target="_blank" rel="noopener">
          Hablar con un asesor
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.hero {
  background: $mesh-navy;
  color: $white;
  overflow: hidden;

  &__inner {
    @include container;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2.5rem;
    padding-block: clamp(3rem, 8vw, 6rem);
  }

  &__copy {
    flex: 1 1 420px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.3rem;
  }

  &__title {
    color: $white;
    font-size: clamp(2.3rem, 5.5vw, 4rem);
    line-height: 1.02;
    max-width: 12ch;
  }

  &__lead {
    color: $text-on-navy;
    font-size: 1.12rem;
    max-width: 46ch;
  }

  &__cta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
  }

  &__badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.7rem 1.4rem;
    margin-top: 0.8rem;
    li {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      font-size: 0.9rem;
      color: $text-on-navy;
      svg { width: 18px; height: 18px; color: $accent; }
    }
  }

  &__visual {
    flex: 1 1 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    min-height: 340px;
  }

  &__drop {
    width: clamp(220px, 40vw, 320px);
    filter: drop-shadow(0 30px 60px rgba(33, 188, 251, 0.4));
    animation: float 6s ease-in-out infinite;
  }

  &__ph {
    position: absolute;
    right: 6%;
    top: 18%;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(8px);
    border-radius: 16px;
    padding: 0.8rem 1.1rem;
    display: flex;
    flex-direction: column;
    text-align: center;
    span { font-family: $font-accent; font-weight: 700; font-size: 1.4rem; color: $accent; }
    small { color: $text-on-navy; font-size: 0.75rem; }
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
}

.water {
  @include container;
  &__head { text-align: center; margin-bottom: 2.2rem; h2 { font-size: clamp(1.6rem, 3.5vw, 2.4rem); margin-top: 0.4rem; } }
  &__strip { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; }
  &__card {
    flex: 1 1 180px;
    max-width: 220px;
    @include card;
    padding: 1.4rem 1.2rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    strong { font-family: $font-principal; font-size: 1.05rem; }
    p { font-size: 0.86rem; color: $text-secondary; flex: 1; }
  }
  &__ph {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 58px;
    padding: 0.4rem 0.7rem;
    border-radius: 12px;
    color: $white;
    font-family: $font-accent;
    font-weight: 700;
  }
}

.featured {
  @include container;
  &__head { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; h2 { font-size: clamp(1.6rem, 3.5vw, 2.4rem); margin-top: 0.3rem; } }
  &__grid { display: flex; flex-wrap: wrap; gap: 1.4rem; > * { flex: 1 1 240px; max-width: calc(25% - 1.05rem); } }
  &__empty { text-align: center; color: $text-secondary; padding: 2rem; background: $surface-2; border-radius: 18px; }

  @include until-lg { &__grid > * { max-width: calc(50% - 0.7rem); } }
  @include until-md { &__grid > * { max-width: 100%; } }
}

.skeleton {
  height: 360px;
  border-radius: 22px;
  background: linear-gradient(100deg, $surface-2 30%, $surface-3 50%, $surface-2 70%);
  background-size: 200% 100%;
  animation: shimmer 1.3s infinite;
}
@keyframes shimmer { to { background-position: -200% 0; } }

.cats {
  @include container;
  &__strip { display: flex; flex-wrap: wrap; gap: 1.2rem; }
  &__card {
    flex: 1 1 260px;
    padding: 1.8rem;
    border-radius: 22px;
    background: $grad-navy;
    color: $white;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    transition: transform 0.2s ease;
    h3 { color: $white; }
    p { color: $text-on-navy; font-size: 0.9rem; flex: 1; }
    &:hover { transform: translateY(-5px); }
  }
  &__go { color: $accent; font-family: $font-accent; font-weight: 600; }
}

.cta-band {
  @include container;
  padding-block: 3rem;
  &__inner {
    background: $grad-water;
    border-radius: 28px;
    padding: clamp(2rem, 5vw, 3.5rem);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    h2 { color: #04263c; }
    p { color: rgba(4, 38, 60, 0.8); font-size: 1.05rem; margin-top: 0.3rem; }
  }
}
</style>
