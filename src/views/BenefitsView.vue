<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { waterTypes, site } from '@/config/site'

const pillars = [
  {
    title: 'Antioxidante',
    body: 'El agua Kangen presenta un potencial de óxido-reducción (ORP) negativo, ayudando a neutralizar radicales libres.',
    icon: 'M12 3v18M4 8l16 8M20 8L4 16',
  },
  {
    title: 'Rica en hidrógeno',
    body: 'La electrólisis libera hidrógeno molecular disuelto, una molécula pequeña con propiedades antioxidantes.',
    icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zM8 12h8M12 8v8',
  },
  {
    title: 'Micro-agrupada',
    body: 'Sus micro-clusters facilitan una hidratación más eficiente a nivel celular.',
    icon: 'M7 8a3 3 0 100-6 3 3 0 000 6zM17 22a3 3 0 100-6 3 3 0 000 6zM7 8c6 0 4 8 10 8',
  },
  {
    title: 'Alcalina',
    body: 'Con un pH de 8.5 a 9.5, acompaña un estilo de vida orientado al equilibrio.',
    icon: 'M12 3l8 4v6c0 5-4 8-8 8s-8-3-8-8V7z',
  },
]
</script>

<template>
  <div class="benefits">
    <section class="benefits__hero">
      <div class="benefits__hero-inner">
        <span class="eyebrow">La ciencia del agua Kangen</span>
        <h1>Cambia tu agua, cambia tu vida</h1>
        <p>
          El agua Kangen® es agua alcalina ionizada producida por los equipos Enagic mediante
          electrólisis. Descubre por qué millones de personas eligen beber diferente.
        </p>
      </div>
    </section>

    <section class="section benefits__pillars">
      <article v-for="p in pillars" :key="p.title" class="benefits__pillar">
        <div class="benefits__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path :d="p.icon" /></svg>
        </div>
        <h3>{{ p.title }}</h3>
        <p>{{ p.body }}</p>
      </article>
    </section>

    <section class="section benefits__water">
      <div class="benefits__water-head">
        <span class="eyebrow">5 aguas, un equipo</span>
        <h2>Cada pH para su propósito</h2>
      </div>
      <div class="benefits__water-list">
        <div v-for="w in waterTypes" :key="w.name" class="benefits__water-row">
          <span class="benefits__ph" :style="{ background: w.tone }">pH {{ w.ph }}</span>
          <div>
            <strong>{{ w.name }}</strong>
            <p>{{ w.use }}</p>
          </div>
          <span :class="w.potable ? 'chip chip--stock' : 'chip'">{{ w.potable ? 'Potable' : 'Uso externo' }}</span>
        </div>
      </div>
    </section>

    <section class="benefits__cta">
      <div class="benefits__cta-inner">
        <h2>Empieza a beber agua Kangen hoy</h2>
        <div class="benefits__cta-actions">
          <RouterLink to="/tienda" class="btn btn--primary btn--lg">Ver ionizadores</RouterLink>
          <a :href="`https://wa.me/${site.contact.whatsapp}`" class="btn btn--light btn--lg" target="_blank" rel="noopener">Pedir asesoría</a>
        </div>
      </div>
    </section>

    <p class="benefits__disclaimer">
      * La información es de carácter divulgativo y no sustituye consejo médico profesional.
    </p>
  </div>
</template>

<style scoped lang="scss">
.benefits {
  &__hero { background: $mesh-navy; color: $white; }
  &__hero-inner {
    @include container;
    padding-block: clamp(3rem, 7vw, 5rem);
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    max-width: 900px;
    h1 { color: $white; font-size: clamp(2rem, 5vw, 3.4rem); }
    p { color: $text-on-navy; font-size: 1.1rem; max-width: 60ch; }
  }

  &__pillars {
    @include container;
    display: flex;
    flex-wrap: wrap;
    gap: 1.4rem;
  }
  &__pillar {
    flex: 1 1 220px;
    @include card;
    padding: 1.8rem;
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    p { color: $text-secondary; font-size: 0.92rem; }
  }
  &__icon {
    width: 54px; height: 54px;
    border-radius: 14px;
    background: rgba(33, 188, 251, 0.12);
    color: $cyan-strong;
    display: flex;
    align-items: center;
    justify-content: center;
    svg { width: 28px; height: 28px; }
  }

  &__water { @include container; }
  &__water-head { text-align: center; margin-bottom: 2rem; h2 { margin-top: 0.3rem; font-size: clamp(1.6rem, 3.5vw, 2.4rem); } }
  &__water-list { display: flex; flex-direction: column; gap: 0.8rem; max-width: 760px; margin-inline: auto; }
  &__water-row {
    display: flex;
    align-items: center;
    gap: 1.1rem;
    @include card;
    padding: 1rem 1.3rem;
    > div { flex: 1; }
    strong { font-family: $font-principal; }
    p { color: $text-secondary; font-size: 0.88rem; }
  }
  &__ph {
    min-width: 76px;
    text-align: center;
    padding: 0.55rem 0.6rem;
    border-radius: 12px;
    color: $white;
    font-family: $font-accent;
    font-weight: 700;
    font-size: 0.9rem;
  }

  &__cta { @include container; padding-block: 3rem; }
  &__cta-inner {
    background: $grad-navy;
    border-radius: 28px;
    padding: clamp(2rem, 5vw, 3.5rem);
    text-align: center;
    color: $white;
    h2 { color: $white; margin-bottom: 1.2rem; }
  }
  &__cta-actions { display: flex; flex-wrap: wrap; gap: 0.8rem; justify-content: center; }

  &__disclaimer { text-align: center; color: $text-secondary; font-size: 0.8rem; padding: 0 1rem 2.5rem; }
}
</style>
