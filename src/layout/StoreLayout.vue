<script setup lang="ts">
import TheHeader from '@/components/globals/TheHeader.vue'
import TheFooter from '@/components/globals/TheFooter.vue'
import CartDrawer from '@/components/CartDrawer.vue'
</script>

<template>
  <div class="store-layout">
    <TheHeader />
    <main class="store-layout__main">
      <slot />
    </main>
    <TheFooter />
    <CartDrawer />
  </div>
</template>

<style scoped lang="scss">
.store-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
</style>
