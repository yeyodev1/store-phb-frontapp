<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { catalogService } from '@/services/catalog.service'
import type { Product } from '@/types'
import { site, method, worlds, themes } from '@/config/site'
import { JUAN, PRESS } from '@/config/media'
import { gsap, ScrollTrigger } from '@/composables/useSmoothScroll'
import ProductCard from '@/components/ProductCard.vue'

const root = ref<HTMLElement | null>(null)
const heroContent = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

// ── Comienza aquí ────────────────────────────────────────────────────────
const starterProducts = ref<Product[]>([])
const starterLoading = ref(true)
const starterFailed = ref(false)

// ── Gratuitos (lead magnets) ─────────────────────────────────────────────
const freeProducts = ref<Product[]>([])
const freeLoading = ref(true)

const hasFreeProducts = computed(() => !freeLoading.value && freeProducts.value.length > 0)

function setupAnimations() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ctx = gsap.context(() => {
    if (reduce) {
      gsap.set('[data-reveal]', { opacity: 1, y: 0 })
      return
    }

    if (heroContent.value) {
      gsap.to(heroContent.value, {
        yPercent: -18,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
      })
    }

    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 88%',
      onEnter: (els) =>
        gsap.to(els, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.09,
          ease: 'power3.out',
          overwrite: true,
        }),
    })
  }, root.value as HTMLElement)
}

async function loadStarterProducts() {
  try {
    starterLoading.value = true
    starterFailed.value = false
    const res = await catalogService.listProducts({ limit: 24 })
    starterProducts.value = res.data.filter((p) => p.displayTier === 'comienza-aqui').slice(0, 4)
  } catch {
    starterFailed.value = true
    starterProducts.value = []
  } finally {
    starterLoading.value = false
  }
}

async function loadFreeProducts() {
  try {
    freeLoading.value = true
    const res = await catalogService.listProducts({ limit: 24 })
    freeProducts.value = res.data.filter((p) => p.isLeadMagnet).slice(0, 4)
  } catch {
    freeProducts.value = []
  } finally {
    freeLoading.value = false
  }
}

onMounted(async () => {
  await Promise.all([loadStarterProducts(), loadFreeProducts()])
  requestAnimationFrame(() => {
    setupAnimations()
    ScrollTrigger.refresh()
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <div class="home" ref="root">
    <!-- ── 01. Hero ─────────────────────────────────────────────────────── -->
    <section class="hero">
      <div class="hero__grid">
        <div class="hero__content" ref="heroContent">
          <span class="hero__eyebrow">Juan Román Garza × PHB</span>
          <h1 class="hero__title">Entiende tu salud. Decide mejor. Actúa antes.</h1>
          <p class="hero__lead">{{ site.description }}</p>

          <div class="hero__cta">
            <RouterLink to="/tienda" class="btn btn--primary btn--lg">Explorar biblioteca</RouterLink>
            <a :href="site.links.evaluacion" class="btn btn--light btn--lg" target="_blank" rel="noopener">
              Evaluar mi salud
            </a>
          </div>

          <ol class="hero__method">
            <li v-for="(step, i) in method" :key="step">
              <span class="hero__method-num">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="hero__method-label">{{ step }}</span>
              <i v-if="i < method.length - 1" class="fa-solid fa-chevron-right hero__method-arrow"></i>
            </li>
          </ol>
        </div>

        <div class="hero__portrait">
          <div class="hero__portrait-frame">
            <img :src="JUAN.portrait" alt="Retrato de Juan Román Garza" />
          </div>
          <p class="hero__portrait-caption">
            Juan Román Garza
            <span>Psicología de la Salud · Medicina Conductual · Longevidad Productiva</span>
          </p>
        </div>
      </div>
    </section>

    <!-- ── Barra de medios ──────────────────────────────────────────────── -->
    <section class="press">
      <div class="press__inner">
        <span class="press__label">Reconocido en</span>
        <div class="press__logos">
          <img v-for="(logo, i) in PRESS" :key="logo" :src="logo" :alt="`Medio de prensa ${i + 1}`" />
        </div>
      </div>
    </section>

    <!-- ── 02. Los mundos ───────────────────────────────────────────────── -->
    <section class="section worlds">
      <div class="worlds__head" data-reveal>
        <span class="eyebrow">El ecosistema</span>
        <h2>Los mundos de PHB</h2>
      </div>
      <div class="worlds__strip">
        <RouterLink
          v-for="w in worlds"
          :key="w.slug"
          :to="`/tienda?category=${w.slug}`"
          class="worlds__card"
          data-reveal
        >
          <span class="worlds__icon"><i :class="w.icon"></i></span>
          <span class="worlds__claim">{{ w.claim }}</span>
          <h3>{{ w.name }}</h3>
          <p>{{ w.copy }}</p>
          <span class="worlds__go">Explorar <i class="fa-solid fa-arrow-right"></i></span>
        </RouterLink>
      </div>
    </section>

    <!-- ── Autoridad: quién está detrás ─────────────────────────────────── -->
    <section class="section authority">
      <div class="authority__grid">
        <div class="authority__photo" data-reveal>
          <img :src="JUAN.seated" alt="Juan Román Garza sentado, cuerpo completo" loading="lazy" />
        </div>
        <div class="authority__copy" data-reveal>
          <span class="eyebrow">Quién está detrás</span>
          <h2>
            ¿Por qué algunas personas logran cambiar, recuperarse y preservar su salud, mientras
            otras continúan deteriorándose aun sabiendo que necesitan actuar?
          </h2>
          <p>
            La respuesta no está solamente en la medicina. Está en la interacción entre conducta y
            biología. En cómo interpretamos nuestra salud. En las decisiones que tomamos —o
            postergamos— cada día.
          </p>
          <p>
            Esta búsqueda me llevó a integrar psicología de la salud, medicina conductual,
            biomarcadores, prevención, tecnología, inteligencia clínica y medicina regenerativa bajo
            una misma filosofía.
          </p>
          <blockquote class="authority__quote">
            Porque el futuro de tu salud no depende únicamente de lo que sabes. Depende de lo que
            decides hacer con lo que sabes.
          </blockquote>
          <p class="authority__signature">— Juan Román Garza</p>
        </div>
      </div>
    </section>

    <!-- ── 03. Comienza aquí ────────────────────────────────────────────── -->
    <section class="section starter">
      <div class="starter__head" data-reveal>
        <div>
          <span class="eyebrow">Punto de partida</span>
          <h2>Comienza aquí</h2>
        </div>
        <p>Los productos que queremos que descubra todo visitante.</p>
      </div>

      <div v-if="starterLoading" class="starter__grid">
        <div v-for="n in 4" :key="n" class="skeleton" />
      </div>
      <div v-else-if="starterProducts.length" class="starter__grid">
        <div v-for="p in starterProducts" :key="p._id" data-reveal class="starter__item">
          <ProductCard :product="p" />
        </div>
      </div>
      <p v-else class="starter__empty">
        {{ starterFailed ? 'No pudimos cargar los productos en este momento.' : 'Muy pronto encontrarás aquí los primeros pasos de tu biblioteca.' }}
      </p>
    </section>

    <!-- ── 04. ¿Qué quieres entender mejor? ─────────────────────────────── -->
    <section class="section themes">
      <div class="themes__head" data-reveal>
        <span class="eyebrow">Entra por tu preocupación</span>
        <h2>¿Qué quieres entender mejor?</h2>
      </div>
      <div class="themes__strip">
        <RouterLink
          v-for="t in themes"
          :key="t.slug"
          :to="`/tienda?theme=${t.slug}`"
          class="themes__card"
          data-reveal
        >
          <span class="themes__icon"><i :class="t.icon"></i></span>
          <h3>{{ t.name }}</h3>
          <p>{{ t.copy }}</p>
        </RouterLink>
      </div>
    </section>

    <!-- ── 05. Gratuitos ────────────────────────────────────────────────── -->
    <section v-if="hasFreeProducts" class="section free">
      <div class="free__head" data-reveal>
        <span class="eyebrow">Sin costo</span>
        <h2>Empieza sin costo.</h2>
      </div>
      <div class="free__grid">
        <div v-for="p in freeProducts" :key="p._id" data-reveal class="free__item">
          <ProductCard :product="p" />
        </div>
      </div>
    </section>

    <!-- ── 06. De aprender a actuar ─────────────────────────────────────── -->
    <section class="section bridge">
      <div class="bridge__inner" data-reveal>
        <h2>Aprender es solamente el primer paso.</h2>
        <p>
          Puedes leer veinte libros sobre salud y continuar tomando las mismas decisiones. El
          verdadero valor del conocimiento aparece cuando puedes utilizarlo para comprender dónde
          estás, qué necesitas cambiar y cuál debería ser tu siguiente paso.
        </p>
        <div class="bridge__paths">
          <a :href="site.links.evaluacion" class="bridge__path" target="_blank" rel="noopener">
            <span class="bridge__path-icon"><i class="fa-solid fa-chart-simple"></i></span>
            <span class="bridge__path-label">Evalúa tu salud con PHB</span>
            <i class="fa-solid fa-arrow-right"></i>
          </a>
          <RouterLink to="/tienda?category=actua" class="bridge__path">
            <span class="bridge__path-icon"><i class="fa-solid fa-bolt"></i></span>
            <span class="bridge__path-label">PHB ACTÚA™</span>
            <i class="fa-solid fa-arrow-right"></i>
          </RouterLink>
          <RouterLink to="/tienda?category=regeneracion" class="bridge__path">
            <span class="bridge__path-icon"><i class="fa-solid fa-dna"></i></span>
            <span class="bridge__path-label">Regeneración</span>
            <i class="fa-solid fa-arrow-right"></i>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ── Prueba social: del escenario a tu casa ───────────────────────── -->
    <section class="proof">
      <img :src="JUAN.auditorium" alt="Juan Román Garza presentando ante un auditorio lleno" class="proof__bg" loading="lazy" />
      <div class="proof__veil"></div>
      <div class="proof__inner" data-reveal>
        <h2>Del escenario a tu casa.</h2>
        <p>
          El mismo marco que Juan Román Garza presenta ante empresas, hospitales y universidades,
          ahora disponible como libros, cursos, evaluaciones y programas.
        </p>
        <RouterLink to="/tienda" class="btn btn--primary btn--lg">Ver todo el catálogo</RouterLink>
      </div>
    </section>

    <!-- ── 07. Cierre ───────────────────────────────────────────────────── -->
    <section class="cta-band">
      <div class="cta-band__inner" data-reveal>
        <h2>{{ site.tagline }}</h2>
        <RouterLink to="/tienda" class="btn btn--navy btn--lg">Ver todo el catálogo</RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
[data-reveal] { opacity: 0; transform: translateY(34px); }

/* ── Hero ─────────────────────────────────────────────────────────────── */
.hero {
  position: relative;
  margin-top: -74px;
  padding-top: 74px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100svh;
  color: $white;
  background: $mesh-navy;
  overflow: hidden;

  &__grid {
    position: relative;
    z-index: 1;
    @include container;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.4rem;
    padding-block: 3rem;

    @include lg {
      flex-direction: row;
      align-items: center;
      gap: 3.5rem;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.4rem;
    width: 100%;

    @include lg {
      flex: 1 1 54%;
    }
  }

  &__portrait {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
    max-width: 360px;

    @include lg {
      flex: 1 1 46%;
      max-width: 420px;
      align-self: stretch;
      justify-content: center;
    }
  }

  &__portrait-frame {
    width: 100%;
    border-radius: 26px;
    border: 1px solid rgba($gold, 0.4);
    box-shadow: $shadow-lg;
    overflow: hidden;
    background: $navy-800;

    img {
      display: block;
      width: 100%;
      max-width: 100%;
      height: auto;
      object-fit: cover;
    }
  }

  &__portrait-caption {
    font-family: $font-accent;
    font-weight: 600;
    font-size: 0.95rem;
    color: $white;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;

    span {
      font-family: $font-secondary;
      font-weight: 400;
      font-size: 0.78rem;
      letter-spacing: 0.03em;
      color: $gold-soft;
    }
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
    font-size: clamp(2.4rem, 7vw, 4.6rem);
    line-height: 1.04;
    font-weight: 800;
    letter-spacing: -0.03em;
    max-width: 20ch;
  }

  &__lead {
    font-size: clamp(1rem, 2.2vw, 1.2rem);
    color: rgba(255, 255, 255, 0.86);
    max-width: 58ch;
  }

  &__cta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    margin-top: 0.4rem;
  }

  &__method {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.6rem 0.9rem;
    margin-top: 1.6rem;
    padding-top: 1.6rem;
    border-top: 1px solid rgba(255, 255, 255, 0.14);
    width: 100%;

    li {
      display: flex;
      align-items: center;
      gap: 0.9rem;
    }
  }

  &__method-num {
    font-family: $font-accent;
    font-size: 0.72rem;
    font-weight: 700;
    color: $accent;
  }

  &__method-label {
    font-family: $font-accent;
    font-size: 0.86rem;
    letter-spacing: 0.04em;
    color: rgba(255, 255, 255, 0.9);
  }

  &__method-arrow {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.35);
  }
}

/* ── Barra de medios ──────────────────────────────────────────────────── */
.press {
  background: $navy;
  border-top: 1px solid rgba(255, 255, 255, 0.08);

  &__inner {
    @include container;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.1rem;
    padding-block: 1.8rem;

    @include md {
      flex-direction: row;
      justify-content: center;
      gap: 2.2rem;
    }
  }

  &__label {
    font-family: $font-accent;
    font-weight: 600;
    font-size: 0.75rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.5);
    white-space: nowrap;
  }

  &__logos {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 2rem;

    img {
      height: 24px;
      max-width: 100%;
      object-fit: contain;
      filter: brightness(0) invert(1);
      opacity: 0.5;
      transition: opacity 0.2s ease;

      &:hover { opacity: 1; }
    }
  }
}

/* ── Autoridad ────────────────────────────────────────────────────────── */
.authority {
  @include container;

  &__grid {
    display: flex;
    flex-direction: column;
    gap: 2.4rem;
    align-items: center;

    @include lg {
      flex-direction: row;
      align-items: center;
      gap: 3.5rem;
    }
  }

  &__photo {
    width: 100%;
    max-width: 380px;
    flex-shrink: 0;

    img {
      display: block;
      width: 100%;
      max-width: 100%;
      height: auto;
      border-radius: 26px;
      box-shadow: $shadow-md;
    }

    @include lg {
      flex: 1 1 40%;
    }
  }

  &__copy {
    display: flex;
    flex-direction: column;
    gap: 1.1rem;

    h2 {
      font-size: clamp(1.5rem, 3.4vw, 2.1rem);
      line-height: 1.3;
      color: $text;
      max-width: 32ch;
    }

    p {
      color: $text-secondary;
      font-size: 1.02rem;
      max-width: 62ch;
    }

    @include lg {
      flex: 1 1 60%;
    }
  }

  &__quote {
    border-left: 3px solid $gold;
    padding-left: 1.2rem;
    margin: 0.4rem 0;
    font-family: $font-accent;
    font-size: 1.1rem;
    font-style: italic;
    color: $text;
    max-width: 52ch;
  }

  &__signature {
    font-family: $font-accent;
    font-weight: 600;
    color: $text-secondary;
  }
}

/* ── Prueba social ────────────────────────────────────────────────────── */
.proof {
  position: relative;
  overflow: hidden;
  display: flex;
  min-height: 60vh;

  &__bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__veil {
    position: absolute;
    inset: 0;
    background: linear-gradient(105deg, rgba(1, 13, 39, 0.94), rgba(1, 13, 39, 0.55));
  }

  &__inner {
    position: relative;
    z-index: 1;
    @include container;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 1.2rem;
    padding-block: 4.5rem;

    h2 {
      color: $white;
      font-size: clamp(1.8rem, 4vw, 2.8rem);
      max-width: 20ch;
    }

    p {
      color: $text-on-navy;
      font-size: 1.05rem;
      max-width: 56ch;
    }
  }
}

/* ── Worlds ───────────────────────────────────────────────────────────── */
.worlds {
  @include container;
  &__head { text-align: center; margin-bottom: 2.4rem; h2 { font-size: clamp(1.7rem, 4vw, 2.6rem); margin-top: 0.5rem; } }
  &__strip { display: flex; flex-wrap: wrap; gap: 1.2rem; }
  &__card {
    flex: 1 1 100%;
    @include card;
    padding: 1.9rem 1.6rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    transition: transform 0.25s ease, box-shadow 0.25s ease;

    h3 { font-size: 1.2rem; margin-top: 0.2rem; }
    p { font-size: 0.9rem; color: $text-secondary; flex: 1; }

    &:hover { transform: translateY(-6px); box-shadow: $shadow-md; }
  }

  &__icon {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $grad-water;
    color: $white;
    font-size: 1.3rem;
  }

  &__claim {
    font-family: $font-accent;
    font-weight: 600;
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: $cyan-strong;
  }

  &__go {
    font-family: $font-accent;
    font-weight: 600;
    font-size: 0.85rem;
    color: $navy;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    margin-top: 0.4rem;
  }

  @include sm {
    &__card { flex: 1 1 calc(50% - 0.6rem); }
  }

  @include lg {
    &__card { flex: 1 1 calc(33.333% - 0.8rem); }
  }
}

/* ── Starter (Comienza aquí) ─────────────────────────────────────────── */
.starter {
  @include container;
  &__head {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-bottom: 2rem;

    h2 { font-size: clamp(1.7rem, 4vw, 2.6rem); margin-top: 0.4rem; }
    p { color: $text-secondary; }
  }
  &__grid { display: flex; flex-wrap: wrap; gap: 1.5rem; }
  &__item { flex: 1 1 100%; display: flex; > * { flex: 1; } }
  &__empty { text-align: center; color: $text-secondary; padding: 2.5rem; background: $surface-2; border-radius: 18px; }

  @include sm {
    &__item { flex: 1 1 calc(50% - 0.75rem); }
  }

  @include lg {
    &__item { flex: 1 1 calc(25% - 1.125rem); }
  }
}

.skeleton {
  flex: 1 1 100%;
  height: 380px;
  border-radius: 22px;
  background: linear-gradient(100deg, $surface-2 30%, $surface-3 50%, $surface-2 70%);
  background-size: 200% 100%;
  animation: shimmer 1.3s infinite;
  opacity: 1;

  @include sm { flex: 1 1 calc(50% - 0.75rem); }
  @include lg { flex: 1 1 calc(25% - 1.125rem); }
}
@keyframes shimmer { to { background-position: -200% 0; } }

/* ── Themes (light surface break) ────────────────────────────────────── */
.themes {
  background: $white;
  &__head { @include container; text-align: center; margin-bottom: 2.4rem; h2 { font-size: clamp(1.7rem, 4vw, 2.6rem); margin-top: 0.5rem; color: $text; } }
  &__strip { @include container; display: flex; flex-wrap: wrap; gap: 1.2rem; }
  &__card {
    flex: 1 1 100%;
    background: $surface;
    border: 1px solid $border;
    border-radius: 20px;
    padding: 1.8rem 1.6rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;

    h3 { color: $text; font-size: 1.1rem; }
    p { color: $text-secondary; font-size: 0.88rem; flex: 1; }

    &:hover { transform: translateY(-6px); box-shadow: $shadow-md; border-color: rgba(33, 188, 251, 0.3); }
  }

  &__icon {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(33, 188, 251, 0.12);
    color: $cyan-strong;
    font-size: 1.1rem;
  }

  @include sm {
    &__card { flex: 1 1 calc(50% - 0.6rem); }
  }

  @include lg {
    &__card { flex: 1 1 calc(33.333% - 0.8rem); }
  }
}

/* ── Free (lead magnets) ─────────────────────────────────────────────── */
.free {
  @include container;
  &__head { text-align: center; margin-bottom: 2.4rem; h2 { font-size: clamp(1.7rem, 4vw, 2.6rem); margin-top: 0.5rem; } }
  &__grid { display: flex; flex-wrap: wrap; gap: 1.5rem; }
  &__item { flex: 1 1 100%; display: flex; > * { flex: 1; } }

  @include sm {
    &__item { flex: 1 1 calc(50% - 0.75rem); }
  }

  @include lg {
    &__item { flex: 1 1 calc(25% - 1.125rem); }
  }
}

/* ── Bridge (de aprender a actuar) ───────────────────────────────────── */
.bridge {
  @include container;
  &__inner {
    background: $grad-navy;
    border-radius: 30px;
    padding: clamp(2rem, 5vw, 3.5rem);
    display: flex;
    flex-direction: column;
    gap: 1.4rem;
    color: $white;

    h2 { color: $white; font-size: clamp(1.7rem, 4vw, 2.6rem); max-width: 24ch; }
    p { color: $text-on-navy; font-size: 1.02rem; max-width: 70ch; }
  }

  &__paths { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 0.6rem; }

  &__path {
    flex: 1 1 100%;
    display: flex;
    align-items: center;
    gap: 0.9rem;
    padding: 1.1rem 1.3rem;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.14);
    color: $white;
    transition: background 0.2s ease, transform 0.2s ease;

    &:hover { background: rgba(255, 255, 255, 0.12); transform: translateY(-3px); }

    i:last-child { margin-left: auto; color: $accent; }
  }

  &__path-icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(33, 188, 251, 0.18);
    color: $accent;
  }

  &__path-label {
    font-family: $font-accent;
    font-weight: 600;
    font-size: 0.95rem;
  }

  @include md {
    &__path { flex: 1 1 calc(33.333% - 0.7rem); }
  }
}

/* ── CTA / cierre ─────────────────────────────────────────────────────── */
.cta-band {
  @include container;
  padding-block: 3.5rem;
  &__inner {
    background: $grad-water;
    border-radius: 30px;
    padding: clamp(2rem, 5vw, 3.5rem);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;

    h2 { color: #04263c; font-size: clamp(1.5rem, 3.6vw, 2.2rem); max-width: 26ch; }
  }

  @include md {
    &__inner { flex-direction: row; align-items: center; justify-content: space-between; }
  }
}
</style>
