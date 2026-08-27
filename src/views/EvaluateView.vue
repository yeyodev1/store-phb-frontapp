<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { catalogService } from '@/services/catalog.service'
import type { Product } from '@/types'
import { site } from '@/config/site'
import { JUAN } from '@/config/media'
import { isLeadMagnet, isPriceOnRequest } from '@/utils/product'
import ProductCard from '@/components/ProductCard.vue'

// ── 01. Micro-beneficios del hero ────────────────────────────────────────
const benefits = [
  {
    icon: 'fa-solid fa-magnifying-glass-chart',
    title: 'Comprende mejor tus datos',
    copy: 'Transforma estudios, síntomas y antecedentes en información más organizada.',
  },
  {
    icon: 'fa-solid fa-list-check',
    title: 'Identifica prioridades',
    copy: 'Distingue qué merece atención inmediata, qué requiere seguimiento y qué puede optimizarse.',
  },
  {
    icon: 'fa-solid fa-compass',
    title: 'Decide con mayor claridad',
    copy: 'Llega mejor preparado a tu próxima decisión, consulta o intervención.',
  },
]

// ── 02. Las evaluaciones ──────────────────────────────────────────────────
const evaluations = ref<Product[]>([])
const loading = ref(true)
const failed = ref(false)
const highlightedSlug = ref<string | null>(null)

const hasEvaluations = computed(() => !loading.value && evaluations.value.length > 0)

/** Orden de negocio: gratuito primero, luego precio ascendente, "a confirmar" al final. */
function priceRank(product: Product): number {
  if (isLeadMagnet(product)) return -Infinity
  if (isPriceOnRequest(product)) return Infinity
  return product.price
}

async function loadEvaluations() {
  try {
    loading.value = true
    failed.value = false
    const res = await catalogService.listProducts({ limit: 100 })
    evaluations.value = res.data
      .filter((p) => p.categorySlugs?.includes('evaluate'))
      .sort((a, b) => priceRank(a) - priceRank(b))
  } catch {
    failed.value = true
    evaluations.value = []
  } finally {
    loading.value = false
  }
}

// ── 03. Cómo funciona PHB ─────────────────────────────────────────────────
const steps = [
  {
    num: '01',
    icon: 'fa-solid fa-clipboard-list',
    name: 'CONOCER',
    copy: 'Recopilamos antecedentes, síntomas, hábitos, objetivos y estudios disponibles.',
  },
  {
    num: '02',
    icon: 'fa-solid fa-ruler-combined',
    name: 'MEDIR',
    copy: 'Identificamos qué datos y biomarcadores pueden ser relevantes.',
  },
  {
    num: '03',
    icon: 'fa-solid fa-brain',
    name: 'INTERPRETAR',
    copy: 'Los resultados se analizan dentro del contexto global de la persona.',
  },
  {
    num: '04',
    icon: 'fa-solid fa-layer-group',
    name: 'PRIORIZAR',
    copy: 'Organizamos hallazgos de acuerdo con importancia, riesgo y oportunidad.',
  },
  {
    num: '05',
    icon: 'fa-solid fa-bolt',
    name: 'ACTUAR',
    copy: 'Se definen posibles siguientes pasos: prevención, seguimiento, consulta o evaluación adicional.',
  },
  {
    num: '06',
    icon: 'fa-solid fa-rotate',
    name: 'REEVALUAR',
    copy: 'La salud cambia. Por eso, medir una sola vez no siempre es suficiente.',
  },
]

// ── 04. ¿Por dónde empiezo? ───────────────────────────────────────────────
const paths = [
  { label: 'Quiero una primera visión de mi salud', slug: 'phb-basic', target: 'PHB Basic' },
  { label: 'Ya tengo análisis clínicos', slug: 'phb-biomarkers', target: 'PHB Biomarkers' },
  { label: 'Tengo varias condiciones o síntomas', slug: 'phb-multisystem', target: 'PHB Multisystem' },
  {
    label: 'Estoy considerando medicina regenerativa',
    slug: 'phb-regenerative-capacity',
    target: 'PHB Regenerative Capacity',
  },
  { label: 'Quiero la evaluación más completa', slug: 'phb-precision', target: 'PHB Precision' },
]

const selectedIndex = ref<number | null>(null)
const whatsappHref = `https://wa.me/${site.contact.whatsapp}`

function selectPath(index: number, slug: string) {
  selectedIndex.value = index
  highlightedSlug.value = slug
  requestAnimationFrame(() => {
    const el = document.querySelector<HTMLElement>(`#evaluaciones [data-slug="${slug}"]`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
}

onMounted(loadEvaluations)
</script>

<template>
  <div class="evaluate">
    <!-- ── 01. Hero ──────────────────────────────────────────────────────── -->
    <section class="eval-hero">
      <div class="eval-hero__grid">
        <div class="eval-hero__content">
          <span class="eval-hero__eyebrow">PHB | DECISION BEFORE INTERVENTION™</span>
          <h1 class="eval-hero__title">
            Antes de decidir qué hacer con tu salud, necesitas entender dónde estás.
          </h1>
          <p class="eval-hero__lead">
            PHB integra cuestionarios, antecedentes, biomarcadores, estudios clínicos y
            diferentes dimensiones de tu salud para ayudarte a identificar riesgos,
            prioridades y próximos pasos con mayor claridad.
          </p>
          <div class="eval-hero__cta">
            <a href="#evaluaciones" class="btn btn--primary btn--lg">Encontrar mi evaluación</a>
            <a href="#metodo" class="btn btn--light btn--lg">¿Cómo funciona PHB?</a>
          </div>
        </div>

        <div class="eval-hero__portrait">
          <div class="eval-hero__portrait-frame">
            <img :src="JUAN.portrait" alt="Retrato de Juan Román Garza" loading="lazy" />
          </div>
        </div>
      </div>

      <ul class="eval-hero__benefits">
        <li v-for="b in benefits" :key="b.title" class="eval-hero__benefit">
          <span class="eval-hero__benefit-icon"><i :class="b.icon"></i></span>
          <div class="eval-hero__benefit-copy">
            <h3>{{ b.title }}</h3>
            <p>{{ b.copy }}</p>
          </div>
        </li>
      </ul>
    </section>

    <!-- ── 02. Las evaluaciones ──────────────────────────────────────────── -->
    <section id="evaluaciones" class="section evaluations">
      <div class="evaluations__head">
        <span class="eyebrow">Catálogo de evaluaciones</span>
        <h2>¿Qué quieres conocer de tu salud?</h2>
        <p>No empieces por el nombre del producto. Empieza por lo que necesitas entender.</p>
      </div>

      <div v-if="loading" class="evaluations__grid">
        <div v-for="n in 3" :key="n" class="skeleton" />
      </div>
      <div v-else-if="hasEvaluations" class="evaluations__grid">
        <div
          v-for="p in evaluations"
          :key="p._id"
          class="evaluations__item"
          :data-slug="p.slug"
          :class="{ 'evaluations__item--active': highlightedSlug === p.slug }"
        >
          <ProductCard :product="p" />
        </div>
      </div>
      <p v-else class="evaluations__empty">
        {{
          failed
            ? 'No pudimos cargar las evaluaciones en este momento.'
            : 'Muy pronto encontrarás aquí las evaluaciones PHB.'
        }}
      </p>
    </section>

    <!-- ── 03. Cómo funciona PHB ─────────────────────────────────────────── -->
    <section id="metodo" class="section method">
      <div class="method__inner">
        <div class="method__head">
          <span class="eyebrow">El método PHB</span>
          <h2>De síntomas fragmentados a decisiones inteligentes.</h2>
        </div>

        <ol class="method__steps">
          <li v-for="(s, i) in steps" :key="s.name" class="method__step">
            <div class="method__step-marker">
              <span class="method__step-num">{{ s.num }}</span>
              <span v-if="i < steps.length - 1" class="method__step-line"></span>
            </div>
            <div class="method__step-body">
              <span class="method__step-icon"><i :class="s.icon"></i></span>
              <h3>{{ s.name }}</h3>
              <p>{{ s.copy }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- ── 04. ¿Por dónde empiezo? ───────────────────────────────────────── -->
    <section class="section finder">
      <div class="finder__head">
        <span class="eyebrow">Guía rápida</span>
        <h2>Encuentra tu evaluación PHB.</h2>
      </div>

      <ul class="finder__list">
        <li v-for="(path, i) in paths" :key="path.slug">
          <button
            type="button"
            class="finder__row"
            :class="{ 'finder__row--active': selectedIndex === i }"
            @click="selectPath(i, path.slug)"
          >
            <i class="fa-solid fa-circle-check finder__row-check"></i>
            <span class="finder__row-text">{{ path.label }}</span>
            <span class="finder__row-target">{{ path.target }}</span>
            <i class="fa-solid fa-chevron-right finder__row-arrow"></i>
          </button>
        </li>
      </ul>

      <div class="finder__helper">
        <span class="finder__helper-icon"><i class="fa-solid fa-circle-question"></i></span>
        <div class="finder__helper-copy">
          <h3>¿No sabes cuál elegir?</h3>
          <p>
            Responde algunas preguntas y te ayudamos a identificar qué nivel de evaluación
            puede tener más sentido para ti.
          </p>
        </div>
        <div class="finder__helper-cta">
          <a :href="site.links.evaluacion" class="btn btn--primary btn--lg" target="_blank" rel="noopener">
            Ayúdame a elegir
          </a>
          <a :href="whatsappHref" class="btn btn--ghost btn--lg" target="_blank" rel="noopener">
            <i class="fa-brands fa-whatsapp"></i>
            Hablar con PHB
          </a>
        </div>
      </div>
    </section>

    <!-- ── 05. Cierre ────────────────────────────────────────────────────── -->
    <section class="cta-band">
      <div class="cta-band__inner">
        <ol class="cta-band__route">
          <li v-for="(s, i) in steps" :key="s.name">
            <span>{{ s.name }}</span>
            <i v-if="i < steps.length - 1" class="fa-solid fa-arrow-right"></i>
          </li>
        </ol>
        <RouterLink to="/tienda" class="btn btn--navy btn--lg">Ver todo el catálogo</RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
/* ── Hero ─────────────────────────────────────────────────────────────── */
.eval-hero {
  background: $mesh-navy;
  color: $white;
  padding-block: clamp(3rem, 8vw, 6rem) clamp(2.5rem, 6vw, 4rem);

  &__grid {
    @include container;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.2rem;

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
    gap: 1.3rem;
    width: 100%;

    @include lg {
      flex: 1 1 56%;
    }
  }

  &__eyebrow {
    font-family: $font-accent;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-size: 0.78rem;
    color: $gold-soft;
    padding: 0.5rem 1rem;
    border: 1px solid rgba(228, 206, 158, 0.4);
    border-radius: 999px;
  }

  &__title {
    color: $white;
    font-size: clamp(2rem, 6vw, 3.6rem);
    line-height: 1.1;
    max-width: 22ch;
  }

  &__lead {
    font-size: clamp(1rem, 2vw, 1.15rem);
    color: $text-on-navy;
    max-width: 58ch;
  }

  &__cta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    margin-top: 0.3rem;
  }

  &__portrait {
    display: flex;
    justify-content: center;
    width: 100%;
    max-width: 340px;

    @include lg {
      flex: 1 1 40%;
      max-width: 380px;
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
      height: auto;
      object-fit: cover;
    }
  }

  &__benefits {
    @include container;
    display: flex;
    flex-wrap: wrap;
    gap: 1.4rem 2.2rem;
    margin-top: 3rem;
    padding-top: 2.2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.14);
  }

  &__benefit {
    flex: 1 1 100%;
    display: flex;
    align-items: flex-start;
    gap: 0.9rem;

    @include sm {
      flex: 1 1 calc(50% - 1.1rem);
    }

    @include lg {
      flex: 1 1 calc(33.333% - 1.5rem);
    }

    h3 {
      color: $white;
      font-size: 1rem;
      margin-bottom: 0.3rem;
    }

    p {
      color: $text-on-navy;
      font-size: 0.88rem;
      max-width: 32ch;
    }
  }

  &__benefit-icon {
    flex-shrink: 0;
    width: 42px;
    height: 42px;
    border-radius: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(33, 188, 251, 0.16);
    color: $accent;
    font-size: 1.05rem;
  }
}

/* ── Evaluaciones ─────────────────────────────────────────────────────── */
.evaluations {
  @include container;

  &__head {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
    max-width: 60ch;
    margin: 0 auto 2.4rem;

    h2 {
      font-size: clamp(1.7rem, 4vw, 2.6rem);
    }

    p {
      color: $text-secondary;
    }
  }

  &__grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  &__item {
    flex: 1 1 100%;
    display: flex;
    border-radius: 22px;
    transition: box-shadow 0.25s ease;

    > * {
      flex: 1;
    }

    &--active {
      box-shadow: 0 0 0 3px rgba(33, 188, 251, 0.45);
    }

    @include sm {
      flex: 1 1 calc(50% - 0.75rem);
    }

    @include lg {
      flex: 1 1 calc(33.333% - 1rem);
    }
  }

  &__empty {
    text-align: center;
    color: $text-secondary;
    padding: 2.5rem;
    background: $surface-2;
    border-radius: 18px;
  }
}

.skeleton {
  flex: 1 1 100%;
  height: 380px;
  border-radius: 22px;
  background: linear-gradient(100deg, $surface-2 30%, $surface-3 50%, $surface-2 70%);
  background-size: 200% 100%;
  animation: shimmer 1.3s infinite;

  @include sm {
    flex: 1 1 calc(50% - 0.75rem);
  }

  @include lg {
    flex: 1 1 calc(33.333% - 1rem);
  }
}
@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}

/* ── Método (fondo claro) ─────────────────────────────────────────────── */
.method {
  background: $white;

  &__inner {
    @include container;
    max-width: 900px;
  }

  &__head {
    text-align: center;
    margin-bottom: 3rem;

    h2 {
      color: $text;
      font-size: clamp(1.7rem, 4vw, 2.6rem);
      margin-top: 0.5rem;
    }
  }

  &__steps {
    display: flex;
    flex-direction: column;
  }

  &__step {
    display: flex;
    gap: 1.3rem;
  }

  &__step-marker {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
  }

  &__step-num {
    font-family: $font-accent;
    font-weight: 700;
    font-size: 0.9rem;
    color: $white;
    background: $grad-water;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__step-line {
    flex: 1;
    width: 2px;
    min-height: 2.4rem;
    background: $border-strong;
    margin-block: 0.4rem;
  }

  &__step-body {
    padding-bottom: 2.2rem;
    flex: 1;

    h3 {
      color: $text;
      font-family: $font-accent;
      letter-spacing: 0.08em;
      font-size: 1.05rem;
      margin: 0.3rem 0 0.35rem;
    }

    p {
      color: $text-secondary;
      font-size: 0.95rem;
      max-width: 52ch;
    }
  }

  &__step-icon {
    color: $cyan-strong;
    font-size: 1.1rem;
  }
}

/* ── Finder (¿por dónde empiezo?) ────────────────────────────────────── */
.finder {
  @include container;
  max-width: 900px;

  &__head {
    text-align: center;
    margin-bottom: 2.2rem;

    h2 {
      font-size: clamp(1.7rem, 4vw, 2.6rem);
      margin-top: 0.5rem;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    margin-bottom: 2.2rem;
  }

  &__row {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.35rem;
    text-align: left;
    padding: 1.1rem 1.3rem;
    border-radius: 18px;
    background: $white;
    border: 1px solid $border;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

    &:hover {
      border-color: rgba(33, 188, 251, 0.4);
      transform: translateY(-2px);
    }

    &--active {
      border-color: $cyan-strong;
      box-shadow: 0 8px 24px rgba(33, 188, 251, 0.18);

      .finder__row-check {
        color: $cyan-strong;
      }
    }

    @include md {
      flex-direction: row;
      align-items: center;
      gap: 0.9rem;
    }
  }

  &__row-check {
    color: $border-strong;
    font-size: 0.9rem;
  }

  &__row-text {
    font-size: 0.98rem;
    color: $text;
    flex: 1;
  }

  &__row-target {
    font-family: $font-accent;
    font-weight: 600;
    font-size: 0.82rem;
    color: $cyan-strong;
  }

  &__row-arrow {
    display: none;
    font-size: 0.75rem;
    color: $text-secondary;

    @include md {
      display: block;
    }
  }

  &__helper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    background: $grad-navy;
    border-radius: 26px;
    padding: clamp(1.8rem, 4vw, 2.6rem);
    color: $white;
  }

  &__helper-icon {
    width: 46px;
    height: 46px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(33, 188, 251, 0.18);
    color: $accent;
    font-size: 1.2rem;
  }

  &__helper-copy {
    h3 {
      color: $white;
      font-size: 1.3rem;
      margin-bottom: 0.4rem;
    }

    p {
      color: $text-on-navy;
      max-width: 56ch;
    }
  }

  &__helper-cta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    margin-top: 0.4rem;
  }
}

/* ── Cierre ───────────────────────────────────────────────────────────── */
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
    gap: 1.6rem;
  }

  &__route {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem 0.8rem;

    li {
      display: flex;
      align-items: center;
      gap: 0.8rem;
    }

    span {
      font-family: $font-accent;
      font-weight: 700;
      font-size: 0.85rem;
      letter-spacing: 0.05em;
      color: #04263c;
    }

    i {
      font-size: 0.7rem;
      color: rgba(4, 38, 60, 0.45);
    }
  }

  @include md {
    &__inner {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
