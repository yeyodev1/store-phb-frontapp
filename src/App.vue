<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import StoreLayout from '@/layout/StoreLayout.vue'
import AdminLayout from '@/layout/AdminLayout.vue'
import Toaster from '@/components/Toaster.vue'
import { initSmoothScroll, destroySmoothScroll } from '@/composables/useSmoothScroll'

const route = useRoute()
const layout = computed(() => (route.meta.admin ? AdminLayout : StoreLayout))

onMounted(() => initSmoothScroll())
onUnmounted(() => destroySmoothScroll())
</script>

<template>
  <component :is="layout">
    <RouterView v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </component>
  <Toaster />
</template>

<style lang="scss">
.page-enter-active,
.page-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
}
</style>
