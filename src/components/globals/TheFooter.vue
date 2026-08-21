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
          <span class="footer__mark">PB</span>
          <div>
            <strong>PowerHouse Biotech</strong>
            <small>{{ site.storeName }}</small>
          </div>
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
    strong { display: block; font-family: $font-principal; color: $white; font-size: 1.05rem; }
    small { font-family: $font-accent; letter-spacing: 0.08em; text-transform: uppercase; color: $accent; font-size: 0.72rem; }
  }

  &__mark {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.14);
    color: $accent;
    font-family: $font-principal;
    font-weight: 800;
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
