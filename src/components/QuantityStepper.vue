<script setup lang="ts">
const props = defineProps<{ modelValue: number; min?: number; max?: number }>()
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

function dec() {
  emit('update:modelValue', Math.max(props.min ?? 1, props.modelValue - 1))
}
function inc() {
  emit('update:modelValue', Math.min(props.max ?? 99, props.modelValue + 1))
}
</script>

<template>
  <div class="stepper">
    <button type="button" @click="dec" aria-label="Restar">−</button>
    <span>{{ modelValue }}</span>
    <button type="button" @click="inc" aria-label="Sumar">+</button>
  </div>
</template>

<style scoped lang="scss">
.stepper {
  display: inline-flex;
  align-items: center;
  border: 1.5px solid $border-strong;
  border-radius: 999px;
  overflow: hidden;

  button {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    font-weight: 600;
    color: $navy;
    transition: background 0.15s ease;
    &:hover { background: $surface-2; }
  }

  span {
    min-width: 40px;
    text-align: center;
    font-family: $font-accent;
    font-weight: 600;
    color: $text;
  }
}
</style>
