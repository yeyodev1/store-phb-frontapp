<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { Category } from '@/types'

const toast = useToastStore()
const categories = ref<Category[]>([])
const loading = ref(true)
const editing = ref<Category | null>(null)

const form = reactive({ name: '', slug: '', description: '', order: 0 })

async function load() {
  loading.value = true
  categories.value = await adminService.listCategories().catch(() => [])
  loading.value = false
}

function edit(c: Category) {
  editing.value = c
  form.name = c.name
  form.slug = c.slug
  form.description = c.description || ''
  form.order = c.order
}
function reset() {
  editing.value = null
  form.name = ''
  form.slug = ''
  form.description = ''
  form.order = categories.value.length
}

async function save() {
  if (!form.name) {
    toast.error('El nombre es requerido')
    return
  }
  try {
    if (editing.value) {
      await adminService.updateCategory(editing.value._id, { ...form })
      toast.success('Categoría actualizada')
    } else {
      await adminService.createCategory({ ...form })
      toast.success('Categoría creada')
    }
    reset()
    load()
  } catch (e) {
    toast.error((e as { message?: string })?.message || 'Error al guardar')
  }
}

async function remove(c: Category) {
  if (!confirm(`¿Eliminar "${c.name}"?`)) return
  try {
    await adminService.deleteCategory(c._id)
    toast.success('Categoría eliminada')
    load()
  } catch {
    toast.error('No se pudo eliminar')
  }
}

onMounted(load)
</script>

<template>
  <div class="ac">
    <header class="ac__head"><h1>Categorías</h1></header>

    <div class="ac__grid">
      <section class="ac__list">
        <div v-if="loading" class="ac__muted">Cargando…</div>
        <div v-else-if="!categories.length" class="ac__muted">Aún no hay categorías.</div>
        <article v-for="c in categories" :key="c._id" class="ac__row">
          <div class="ac__info">
            <strong>{{ c.name }}</strong>
            <span class="ac__slug">/{{ c.slug }}</span>
            <p>{{ c.description }}</p>
          </div>
          <div class="ac__actions">
            <button class="btn btn--ghost btn--sm" @click="edit(c)"><i class="fa-solid fa-pen"></i> Editar</button>
            <button class="ac__del" @click="remove(c)" aria-label="Eliminar"><i class="fa-solid fa-trash"></i></button>
          </div>
        </article>
      </section>

      <aside class="ac__form">
        <h3>{{ editing ? 'Editar categoría' : 'Nueva categoría' }}</h3>
        <label class="field"><span>Nombre</span><input v-model="form.name" type="text" /></label>
        <label class="field"><span>Slug (opcional)</span><input v-model="form.slug" type="text" placeholder="se genera del nombre" /></label>
        <label class="field"><span>Descripción</span><textarea v-model="form.description" rows="3"></textarea></label>
        <label class="field"><span>Orden</span><input v-model.number="form.order" type="number" /></label>
        <div class="ac__form-actions">
          <button class="btn btn--primary" @click="save">{{ editing ? 'Guardar' : 'Crear' }}</button>
          <button v-if="editing" class="btn btn--ghost" @click="reset">Cancelar</button>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ac {
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
  &__head h1 { font-size: 1.6rem; }

  &__grid { display: flex; flex-wrap: wrap; gap: 1.3rem; align-items: flex-start; }
  &__list { flex: 1 1 340px; display: flex; flex-direction: column; gap: 0.7rem; }
  &__muted { color: $text-secondary; padding: 1.5rem; text-align: center; @include card; }

  &__row { @include card; padding: 1.1rem 1.3rem; display: flex; justify-content: space-between; gap: 1rem; align-items: center; }
  &__info { flex: 1; strong { font-family: $font-principal; } p { color: $text-secondary; font-size: 0.85rem; margin-top: 0.2rem; } }
  &__slug { font-size: 0.78rem; color: $cyan-strong; margin-left: 0.5rem; }
  &__actions { display: flex; align-items: center; gap: 0.4rem; }
  &__del { width: 38px; height: 38px; border-radius: 10px; &:hover { background: rgba(239,68,68,0.1); } }

  &__form {
    flex: 1 1 280px;
    position: sticky;
    top: 84px;
    @include card;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    h3 { font-size: 1.15rem; }
  }
  &__form-actions { display: flex; gap: 0.6rem; margin-top: 0.3rem; }
}
.field {
  display: flex; flex-direction: column; gap: 0.4rem;
  span { font-size: 0.85rem; font-weight: 600; }
  input, textarea { border: 1.5px solid $border-strong; border-radius: 12px; padding: 0.7rem 0.85rem; &:focus { outline: none; border-color: $cyan; } }
  textarea { resize: vertical; }
}
</style>
