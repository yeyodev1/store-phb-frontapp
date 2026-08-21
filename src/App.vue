<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StoreLayout from '@/layout/StoreLayout.vue'
import AdminLayout from '@/layout/AdminLayout.vue'
import Toaster from '@/components/Toaster.vue'
import PageCurtain from '@/components/PageCurtain.vue'
import { initSmoothScroll, destroySmoothScroll } from '@/composables/useSmoothScroll'
import { installPageTransition } from '@/composables/usePageTransition'

const route = useRoute()
const router = useRouter()
const layout = computed(() => (route.meta.admin ? AdminLayout : StoreLayout))

onMounted(() => {
  initSmoothScroll()
  installPageTransition(router)
})
onUnmounted(() => destroySmoothScroll())
</script>

<template>
  <component :is="layout">
    <RouterView v-slot="{ Component, route: r }">
      <transition :name="r.meta.admin ? 'admin-view' : 'no-anim'" mode="out-in">
        <component :is="Component" :key="r.path" />
      </transition>
    </RouterView>
  </component>
  <Toaster />
  <PageCurtain />
</template>
