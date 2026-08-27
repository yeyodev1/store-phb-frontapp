<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { site } from '@/config/site'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <div class="footer__logo">
          <span class="footer__logo-name">{{ site.brand }}</span>
          <span class="footer__logo-sub">× {{ site.storeName }}</span>
        </div>
        <p class="footer__tagline">{{ site.tagline }}</p>
        <a :href="`https://wa.me/${site.contact.whatsapp}`" class="btn btn--gold btn--sm" target="_blank" rel="noopener">
          <i class="fa-brands fa-whatsapp"></i>
          Escríbenos por WhatsApp
        </a>
      </div>

      <div class="footer__col">
        <h4>Ecosistema</h4>
        <RouterLink to="/tienda">Catálogo</RouterLink>
        <a :href="site.links.evaluacion" target="_blank" rel="noopener">Evaluación</a>
        <a :href="site.links.hub" target="_blank" rel="noopener">Hub de salud</a>
      </div>

      <div class="footer__col">
        <h4>Cuenta</h4>
        <RouterLink to="/cuenta">Mi cuenta</RouterLink>
        <RouterLink to="/login">Iniciar sesión</RouterLink>
      </div>

      <div class="footer__col">
        <h4>Contacto</h4>
        <span>{{ site.contact.person }}</span>
        <a :href="`tel:${site.contact.phone.replace(/\s/g, '')}`">{{ site.contact.phone }}</a>
        <a :href="`mailto:${site.contact.email}`">{{ site.contact.email }}</a>
      </div>
    </div>

    <div class="footer__legal">
      <p>
        El contenido de esta tienda tiene fines educativos e informativos y no sustituye una consulta,
        diagnóstico o tratamiento médico profesional. Toda intervención clínica requiere evaluación
        previa e indicación de un profesional de la salud.
      </p>
    </div>

    <div class="footer__bottom">
      <span>© {{ year }} {{ site.brand }} × {{ site.storeName }}</span>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  background: $mesh-navy;
  color: $text-on-navy;
  margin-top: auto;

  &__inner {
    @include container;
    display: flex;
    flex-wrap: wrap;
    gap: 2.5rem;
    padding-block: clamp(2.5rem, 6vw, 4rem);
  }

  &__brand {
    flex: 1 1 260px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  &__logo {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__logo-name {
    font-family: $font-principal;
    font-weight: 700;
    font-size: 1.3rem;
    color: $white;
  }

  &__logo-sub {
    font-family: $font-accent;
    font-size: 0.75rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: $accent;
  }

  &__tagline {
    font-family: $font-principal;
    font-size: 1.15rem;
    color: $white;
    max-width: 260px;
  }

  &__col {
    flex: 1 1 150px;
    display: flex;
    flex-direction: column;
    gap: 0.7rem;

    h4 {
      color: $white;
      font-size: 0.95rem;
      margin-bottom: 0.2rem;
    }
    a, span {
      font-size: 0.9rem;
      color: $text-on-navy;
      transition: color 0.15s ease;
    }
    a:hover { color: $accent; }
  }

  &__legal {
    @include container;
    padding-top: 0.4rem;

    p {
      font-size: 0.78rem;
      line-height: 1.5;
      color: rgba(255, 255, 255, 0.5);
      max-width: 760px;
    }
  }

  &__bottom {
    @include container;
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    justify-content: space-between;
    padding-block: 1.3rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 0.82rem;
    color: rgba(255, 255, 255, 0.55);
  }
}
</style>
