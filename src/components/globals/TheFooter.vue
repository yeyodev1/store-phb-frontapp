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
          <img src="/img/logo-white.png" alt="PowerHouse Biotech" class="footer__logo-img" />
        </div>
        <p class="footer__tagline">{{ site.tagline }}</p>
        <a :href="`https://wa.me/${site.contact.whatsapp}`" class="btn btn--gold btn--sm" target="_blank" rel="noopener">
          Escríbenos por WhatsApp
        </a>
      </div>

      <div class="footer__col">
        <h4>Tienda</h4>
        <RouterLink to="/tienda">Todos los productos</RouterLink>
        <RouterLink to="/tienda?category=ionizadores">Ionizadores</RouterLink>
        <RouterLink to="/tienda?category=spa-ducha">Spa & Ducha</RouterLink>
        <RouterLink to="/tienda?category=filtros-repuestos">Filtros</RouterLink>
      </div>

      <div class="footer__col">
        <h4>Compañía</h4>
        <RouterLink to="/beneficios">Beneficios del agua</RouterLink>
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

    <div class="footer__bottom">
      <span>© {{ year }} PowerHouse Biotech · Agua Kangen</span>
      <span>Distribuidor oficial Enagic®</span>
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
    align-items: center;
    gap: 0.7rem;
  }

  &__logo-img {
    height: 44px;
    width: auto;
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
