<script setup lang="ts">
import { useToastStore } from '@/stores/toast'
const toast = useToastStore()
</script>

<template>
  <teleport to="body">
    <div class="toaster">
      <transition-group name="toast">
        <div v-for="t in toast.items" :key="t.id" class="toast" :class="`toast--${t.type}`">
          <span class="toast__dot" />
          <span class="toast__msg">{{ t.message }}</span>
          <button class="toast__x" @click="toast.dismiss(t.id)" aria-label="Cerrar"><i class="fa-solid fa-xmark"></i></button>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<style scoped lang="scss">
.toaster {
  position: fixed;
  z-index: 120;
  bottom: 1.3rem;
  right: 1.3rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  max-width: min(92vw, 360px);
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.9rem 1.1rem;
  border-radius: 14px;
  background: $white;
  border: 1px solid $border;
  box-shadow: $shadow-md;

  &__dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  &__msg { font-size: 0.9rem; font-weight: 500; flex: 1; }
  &__x { color: $text-secondary; font-size: 0.85rem; }

  &--success .toast__dot { background: $success; }
  &--error .toast__dot { background: $error; }
  &--info .toast__dot { background: $info; }
}

.toast-enter-active, .toast-leave-active { transition: all 0.28s cubic-bezier(0.22, 1, 0.36, 1); }
.toast-enter-from { opacity: 0; transform: translateX(40px); }
.toast-leave-to { opacity: 0; transform: translateY(10px); }
</style>
