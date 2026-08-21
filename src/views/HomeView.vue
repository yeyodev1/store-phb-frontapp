<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { catalogService } from '@/services/catalog.service'
import type { Product, Category } from '@/types'
import { site, waterTypes, trustBadges } from '@/config/site'
import ProductCard from '@/components/ProductCard.vue'

const featured = ref<Product[]>([])
const categories = ref<Category[]>([])
const loading = ref(true)

// Hero parallax — progress 0 at the very top (full opacity), 1 after one screen.
const heroP = ref(0)
let raf = 0
function onHeroScroll() {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    heroP.value = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.85)))
  })
}

// Content drifts up & fades, video slowly zooms, overlay deepens.
const heroStyle = computed(() => ({
  '--content-y': `${heroP.value * -110}px`,
  '--content-o': String(Math.max(0, 1 - heroP.value * 1.15)),
  '--video-scale': String(1 + heroP.value * 0.22),
  '--overlay-o': String(0.68 + heroP.value * 0.28),
}))

onMounted(() => {
  window.addEventListener('scroll', onHeroScroll, { passive: true })
})
onUnmounted(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('scroll', onHeroScroll)
})

onMounted(async () => {
  try {
    const [f, c] = await Promise.all([
      catalogService.listProducts({ featured: true, limit: 4 }),
      catalogService.listCategories(),
    ])
    featured.value = f.data
    categories.value = c
  } catch {
    /* API offline — page still renders */
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="home">
    <!-- ── Cinematic video hero ─────────────────────────────────────────── -->
    <section class="hero" :style="heroStyle">
      <div class="hero__media">
        <video
          class="hero__video"
          autoplay
          muted
          loop
          playsinline
          preload="auto"
          poster="/img/hero-poster.jpg"
        >
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
        <div class="hero__overlay"></div>
      </div>

      <div class="hero__content">
        <span class="hero__eyebrow">Distribuidor oficial Enagic®</span>
        <h1 class="hero__title">
          Cambia tu <em>Agua</em>,<br />Cambia tu <em>Vida</em>
        </h1>
        <p class="hero__lead">
          Ionizadores Kangen que convierten el agua del grifo en agua alcalina rica en
          hidrógeno — antioxidante, micro-agrupada y con tecnología médica japonesa.
        </p>
        <div class="hero__cta">
          <RouterLink to="/tienda" class="btn btn--primary btn--lg">Ver ionizadores</RouterLink>
          <RouterLink to="/beneficios" class="btn btn--light btn--lg">Descubre por qué</RouterLink>
        </div>
      </div>

      <div class="hero__scroll">
        <span></span>
        Desliza
      </div>
    </section>

    <!-- ── Trust marquee ────────────────────────────────────────────────── -->
    <div class="marquee">
      <div class="marquee__track">
        <span v-for="(b, i) in [...trustBadges, ...trustBadges]" :key="i">
          {{ b }} <em>◆</em>
        </span>
      </div>
    </div>

    <!-- ── 5 waters ─────────────────────────────────────────────────────── -->
    <section class="section water">
      <div class="water__head" v-reveal>
        <span class="eyebrow">Un solo equipo · 5 tipos de agua</span>
        <h2>El agua correcta para cada momento</h2>
      </div>
      <div class="water__strip">
        <article
          v-for="(w, i) in waterTypes"
          :key="w.name"
          class="water__card"
          v-reveal="{ delay: i * 90 }"
        >
          <span class="water__ph" :style="{ background: w.tone }">{{ w.ph }}</span>
          <strong>{{ w.name }}</strong>
          <p>{{ w.use }}</p>
          <span :class="w.potable ? 'chip chip--stock' : 'chip'">
            {{ w.potable ? 'Potable' : 'Uso externo' }}
          </span>
        </article>
      </div>
    </section>

    <!-- ── Featured products ────────────────────────────────────────────── -->
    <section class="section featured">
      <div class="featured__head" v-reveal>
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
        <div v-for="(p, i) in featured" :key="p._id" v-reveal="{ delay: i * 80 }" class="featured__item">
          <ProductCard :product="p" />
        </div>
      </div>
      <p v-else class="featured__empty">
        Aún no hay productos cargados. Ejecuta el seed del backend.
      </p>
    </section>

    <!-- ── Parallax video band (scroll-combined) ────────────────────────── -->
    <section class="band">
      <div class="band__media">
        <video class="band__video" autoplay muted loop playsinline poster="/img/hero-poster.jpg">
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
        <div class="band__overlay"></div>
      </div>
      <div class="band__content" v-reveal>
        <span class="eyebrow band__eyebrow">La ciencia del agua Kangen</span>
        <h2>Hidrógeno molecular.<br />Poder antioxidante real.</h2>
        <p>
          Con un ORP negativo de hasta −400 mV, el agua Kangen ayuda a neutralizar
          radicales libres. Pequeñas moléculas de hidrógeno, gran diferencia.
        </p>
        <RouterLink to="/beneficios" class="btn btn--light btn--lg">Ver la ciencia</RouterLink>
      </div>
    </section>

    <!-- ── Categories ───────────────────────────────────────────────────── -->
    <section v-if="categories.length" class="section cats">
      <div class="cats__strip">
        <RouterLink
          v-for="(c, i) in categories"
          :key="c._id"
          :to="`/tienda?category=${c.slug}`"
          class="cats__card"
          v-reveal="{ delay: i * 90 }"
        >
          <h3>{{ c.name }}</h3>
          <p>{{ c.description }}</p>
          <span class="cats__go">Explorar →</span>
        </RouterLink>
      </div>
    </section>

    <!-- ── CTA ──────────────────────────────────────────────────────────── -->
    <section class="cta-band">
      <div class="cta-band__inner" v-reveal>
        <div>
          <h2>¿No sabes qué modelo elegir?</h2>
          <p>Te asesoramos según tu familia, tu consumo y tu presupuesto.</p>
        </div>
        <a :href="`https://wa.me/${site.contact.whatsapp}`" class="btn btn--navy btn--lg" target="_blank" rel="noopener">
          Hablar con un asesor
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
/* ── Hero ─────────────────────────────────────────────────────────────── */
.hero {
  position: relative;
  min-height: 100svh;
  margin-top: -72px; // pull under the transparent sticky header for a full-bleed video
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  color: $white;

  &__media {
    position: absolute;
    inset: 0;
    z-index: 0;
    background: $navy; // dark base so the hero is never white before the video paints
  }

  &__video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(var(--video-scale, 1));
    transition: transform 0.1s linear;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(1, 13, 39, 0.7) 0%, rgba(1, 13, 39, 0.5) 40%, rgba(1, 13, 39, 0.96) 100%),
      linear-gradient(90deg, rgba(1, 13, 39, 0.94) 0%, rgba(1, 13, 39, 0.5) 45%, transparent 78%);
    opacity: var(--overlay-o, 0.85);
  }

  &__content {
    position: relative;
    z-index: 1;
    @include container;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.4rem;
    transform: translateY(var(--content-y, 0));
    opacity: var(--content-o, 1);
  }

  &__eyebrow {
    font-family: $font-accent;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-size: 0.8rem;
    color: $gold-soft;
    padding: 0.5rem 1rem;
    border: 1px solid rgba(228, 206, 158, 0.4);
    border-radius: 999px;
  }

  &__title {
    color: $white;
    font-size: clamp(2.8rem, 8vw, 6rem);
    line-height: 0.98;
    font-weight: 800;
    letter-spacing: -0.03em;
    text-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
    em {
      font-style: normal;
      background: $grad-water;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  &__lead {
    font-size: clamp(1rem, 2.2vw, 1.25rem);
    color: rgba(255, 255, 255, 0.85);
    max-width: 48ch;
  }

  &__cta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    margin-top: 0.4rem;
  }

  &__scroll {
    position: absolute;
    bottom: 1.6rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    font-family: $font-accent;
    font-size: 0.72rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.7);
    opacity: var(--content-o, 1);
    span {
      width: 24px;
      height: 38px;
      border: 2px solid rgba(255, 255, 255, 0.5);
      border-radius: 999px;
      position: relative;
      &::before {
        content: '';
        position: absolute;
        top: 7px;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 8px;
        border-radius: 999px;
        background: $accent;
        animation: scrolldot 1.6s ease-in-out infinite;
      }
    }
  }
}
@keyframes scrolldot { 0%,100% { transform: translate(-50%, 0); opacity: 1; } 50% { transform: translate(-50%, 12px); opacity: 0.3; } }

/* ── Marquee ──────────────────────────────────────────────────────────── */
.marquee {
  background: $navy;
  color: $white;
  overflow: hidden;
  padding: 0.9rem 0;
  &__track {
    display: flex;
    gap: 2.5rem;
    white-space: nowrap;
    width: max-content;
    animation: marquee 26s linear infinite;
    span { font-family: $font-accent; font-weight: 500; font-size: 0.9rem; letter-spacing: 0.05em; display: inline-flex; gap: 2.5rem; em { color: $accent; font-style: normal; } }
  }
}
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

/* ── Water ────────────────────────────────────────────────────────────── */
.water {
  @include container;
  &__head { text-align: center; margin-bottom: 2.4rem; h2 { font-size: clamp(1.7rem, 4vw, 2.6rem); margin-top: 0.5rem; } }
  &__strip { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; }
  &__card {
    flex: 1 1 180px;
    max-width: 220px;
    @include card;
    padding: 1.5rem 1.3rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.6rem;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    strong { font-family: $font-principal; font-size: 1.05rem; }
    p { font-size: 0.86rem; color: $text-secondary; flex: 1; }
    &:hover { transform: translateY(-6px); box-shadow: $shadow-md; }
  }
  &__ph { display: inline-flex; align-items: center; justify-content: center; min-width: 58px; padding: 0.45rem 0.7rem; border-radius: 12px; color: $white; font-family: $font-accent; font-weight: 700; }
}

/* ── Featured ─────────────────────────────────────────────────────────── */
.featured {
  @include container;
  &__head { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; h2 { font-size: clamp(1.7rem, 4vw, 2.6rem); margin-top: 0.4rem; } }
  &__grid { display: flex; flex-wrap: wrap; gap: 1.5rem; }
  &__item { flex: 1 1 240px; max-width: calc(25% - 1.125rem); display: flex; > * { flex: 1; } }
  &__empty { text-align: center; color: $text-secondary; padding: 2rem; background: $surface-2; border-radius: 18px; }

  @include until-lg { &__item { max-width: calc(50% - 0.75rem); } }
  @include until-md { &__item { max-width: 100%; } }
}
.skeleton { flex: 1 1 240px; max-width: calc(25% - 1.125rem); height: 380px; border-radius: 22px; background: linear-gradient(100deg, $surface-2 30%, $surface-3 50%, $surface-2 70%); background-size: 200% 100%; animation: shimmer 1.3s infinite; }
@keyframes shimmer { to { background-position: -200% 0; } }

/* ── Parallax band ────────────────────────────────────────────────────── */
.band {
  position: relative;
  min-height: 78vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  color: $white;
  margin-block: 1rem;

  &__media { position: absolute; inset: 0; z-index: 0; background: $navy; }
  &__video { width: 100%; height: 100%; object-fit: cover; }
  &__overlay { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(1,13,39,0.92) 0%, rgba(1,13,39,0.55) 55%, rgba(1,13,39,0.3) 100%); }

  &__content {
    position: relative;
    z-index: 1;
    @include container;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.2rem;
    max-width: 640px;
    h2 { color: $white; font-size: clamp(1.8rem, 4.5vw, 3rem); }
    p { color: rgba(255,255,255,0.85); font-size: 1.1rem; }
  }
  &__eyebrow { color: $accent; }
}

/* ── Categories ───────────────────────────────────────────────────────── */
.cats {
  @include container;
  &__strip { display: flex; flex-wrap: wrap; gap: 1.2rem; }
  &__card {
    flex: 1 1 260px;
    padding: 1.9rem;
    border-radius: 22px;
    background: $grad-navy;
    color: $white;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    overflow: hidden;
    position: relative;
    transition: transform 0.25s ease;
    h3 { color: $white; }
    p { color: $text-on-navy; font-size: 0.9rem; flex: 1; }
    &::after { content: ''; position: absolute; top: -40%; right: -20%; width: 60%; height: 120%; background: radial-gradient(circle, rgba(33,188,251,0.25) 0%, transparent 70%); }
    &:hover { transform: translateY(-6px); }
  }
  &__go { color: $accent; font-family: $font-accent; font-weight: 600; position: relative; z-index: 1; }
}

/* ── CTA ──────────────────────────────────────────────────────────────── */
.cta-band {
  @include container;
  padding-block: 3.5rem;
  &__inner {
    background: $grad-water;
    border-radius: 30px;
    padding: clamp(2rem, 5vw, 3.5rem);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    h2 { color: #04263c; }
    p { color: rgba(4,38,60,0.82); font-size: 1.05rem; margin-top: 0.3rem; }
  }
}
</style>
