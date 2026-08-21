<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import StoreLayout from '@/layout/StoreLayout.vue'
import AdminLayout from '@/layout/AdminLayout.vue'
import Toaster from '@/components/Toaster.vue'

const route = useRoute()
const layout = computed(() => (route.meta.admin ? AdminLayout : StoreLayout))
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
