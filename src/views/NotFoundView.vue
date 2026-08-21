<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="notfound">
    <span class="notfound__code">404</span>
    <h1>Página no encontrada</h1>
    <p>La página que buscas no existe o fue movida.</p>
    <RouterLink to="/" class="btn btn--primary btn--lg">Volver al inicio</RouterLink>
  </div>
</template>

<style scoped lang="scss">
.notfound {
  @include container;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1rem;
  padding-block: 4rem;
  &__code {
    font-family: $font-accent;
    font-weight: 700;
    font-size: clamp(4rem, 14vw, 8rem);
    line-height: 1;
    background: $grad-water;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  p { color: $text-secondary; }
}
</style>
