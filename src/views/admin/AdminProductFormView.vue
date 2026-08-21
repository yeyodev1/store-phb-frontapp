<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminService } from '@/services/admin.service'
import { catalogService } from '@/services/catalog.service'
import { useToastStore } from '@/stores/toast'
import type { Category, Spec } from '@/types'

const route = useRoute()
const router = useRouter()
const toast = useToastStore()

const id = computed(() => route.params.id as string | undefined)
const isEdit = computed(() => !!id.value)
const categories = ref<Category[]>([])
const saving = ref(false)

const form = reactive({
  name: '',
  modelCode: '',
  categorySlug: '',
  price: 0,
  compareAtPrice: 0,
  stock: 0,
  shortDescription: '',
  description: '',
  featured: false,
  isActive: true,
  benefitsText: '',
  imagesText: '',
  tagsText: '',
  specs: [] as Spec[],
})

function addSpec() {
  form.specs.push({ label: '', value: '' })
}
function removeSpec(i: number) {
  form.specs.splice(i, 1)
}

onMounted(async () => {
  categories.value = await catalogService.listCategories().catch(() => [])
  if (isEdit.value && id.value) {
    try {
      const p = await adminService.getProduct(id.value)
      form.name = p.name
      form.modelCode = p.modelCode || ''
      form.categorySlug = p.categorySlug || ''
      form.price = p.price
      form.compareAtPrice = p.compareAtPrice || 0
      form.stock = p.stock
      form.shortDescription = p.shortDescription || ''
      form.description = p.description || ''
      form.featured = p.featured
      form.isActive = p.isActive
      form.benefitsText = (p.benefits || []).join('\n')
      form.imagesText = (p.images || []).join('\n')
      form.tagsText = (p.tags || []).join(', ')
      form.specs = p.specs || []
    } catch {
      toast.error('No se pudo cargar el producto')
    }
  }
})

async function save() {
  if (!form.name || form.price <= 0) {
    toast.error('Nombre y precio son requeridos')
    return
  }
  saving.value = true
  const payload = {
    name: form.name,
    modelCode: form.modelCode,
    categorySlug: form.categorySlug || undefined,
    price: Number(form.price),
    compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
    stock: Number(form.stock),
    shortDescription: form.shortDescription,
    description: form.description,
    featured: form.featured,
    isActive: form.isActive,
    benefits: form.benefitsText.split('\n').map((s) => s.trim()).filter(Boolean),
    images: form.imagesText.split('\n').map((s) => s.trim()).filter(Boolean),
    tags: form.tagsText.split(',').map((s) => s.trim()).filter(Boolean),
    specs: form.specs.filter((s) => s.label && s.value),
  }
  try {
    if (isEdit.value && id.value) {
      await adminService.updateProduct(id.value, payload)
      toast.success('Producto actualizado')
    } else {
      await adminService.createProduct(payload)
      toast.success('Producto creado')
    }
    router.push('/admin/productos')
  } catch (e) {
    toast.error((e as { message?: string })?.message || 'No se pudo guardar')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="pf">
    <header class="pf__head">
      <h1>{{ isEdit ? 'Editar producto' : 'Nuevo producto' }}</h1>
      <button class="btn btn--ghost btn--sm" @click="router.push('/admin/productos')">← Volver</button>
    </header>

    <form class="pf__grid" @submit.prevent="save">
      <div class="pf__col">
        <section class="pf__card">
          <h3>Información básica</h3>
          <label class="field"><span>Nombre *</span><input v-model="form.name" type="text" required /></label>
          <div class="field-row">
            <label class="field"><span>Modelo</span><input v-model="form.modelCode" type="text" /></label>
            <label class="field">
              <span>Categoría</span>
              <select v-model="form.categorySlug">
                <option value="">Sin categoría</option>
                <option v-for="c in categories" :key="c._id" :value="c.slug">{{ c.name }}</option>
              </select>
            </label>
          </div>
          <label class="field"><span>Descripción corta</span><input v-model="form.shortDescription" type="text" /></label>
          <label class="field"><span>Descripción completa</span><textarea v-model="form.description" rows="5"></textarea></label>
        </section>

        <section class="pf__card">
          <h3>Beneficios <small>(uno por línea)</small></h3>
          <textarea v-model="form.benefitsText" rows="5" placeholder="Uso individual o en pareja&#10;Pantalla LCD..."></textarea>
        </section>

        <section class="pf__card">
          <div class="pf__card-head">
            <h3>Especificaciones</h3>
            <button type="button" class="btn btn--ghost btn--sm" @click="addSpec">+ Añadir</button>
          </div>
          <div v-for="(s, i) in form.specs" :key="i" class="pf__spec">
            <input v-model="s.label" placeholder="Etiqueta" />
            <input v-model="s.value" placeholder="Valor" />
            <button type="button" class="pf__spec-del" @click="removeSpec(i)">✕</button>
          </div>
        </section>
      </div>

      <div class="pf__col pf__col--side">
        <section class="pf__card">
          <h3>Precio e inventario</h3>
          <label class="field"><span>Precio (USD) *</span><input v-model.number="form.price" type="number" min="0" step="1" required /></label>
          <label class="field"><span>Precio comparado</span><input v-model.number="form.compareAtPrice" type="number" min="0" step="1" /></label>
          <label class="field"><span>Stock</span><input v-model.number="form.stock" type="number" min="0" /></label>
        </section>

        <section class="pf__card">
          <h3>Imágenes <small>(URL por línea)</small></h3>
          <textarea v-model="form.imagesText" rows="3" placeholder="https://..."></textarea>
          <label class="field"><span>Tags (separados por coma)</span><input v-model="form.tagsText" type="text" /></label>
        </section>

        <section class="pf__card">
          <h3>Estado</h3>
          <label class="pf__toggle"><input v-model="form.featured" type="checkbox" /> Destacado</label>
          <label class="pf__toggle"><input v-model="form.isActive" type="checkbox" /> Activo (visible en tienda)</label>
        </section>

        <button type="submit" class="btn btn--primary btn--block btn--lg" :disabled="saving">
          {{ saving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear producto' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
.pf {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;

  &__head { display: flex; justify-content: space-between; align-items: center; gap: 1rem; h1 { font-size: 1.6rem; } }

  &__grid { display: flex; flex-wrap: wrap; gap: 1.3rem; align-items: flex-start; }
  &__col { flex: 1 1 340px; display: flex; flex-direction: column; gap: 1.3rem; }
  &__col--side { flex: 1 1 260px; position: sticky; top: 84px; }

  &__card {
    @include card;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    h3 { font-size: 1.1rem; small { color: $text-secondary; font-weight: 400; } }
  }
  &__card-head { display: flex; justify-content: space-between; align-items: center; }

  &__spec { display: flex; gap: 0.5rem; input { flex: 1; } }
  &__spec-del { width: 40px; color: $text-secondary; border-radius: 8px; &:hover { background: rgba(239,68,68,0.1); color: $error; } }

  &__toggle { display: flex; align-items: center; gap: 0.6rem; font-weight: 500; input { width: 18px; height: 18px; accent-color: $cyan; } }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
  span { font-size: 0.85rem; font-weight: 600; }
}
.field-row { display: flex; flex-wrap: wrap; gap: 1rem; }
input, textarea, select {
  border: 1.5px solid $border-strong;
  border-radius: 12px;
  padding: 0.7rem 0.85rem;
  background: $white;
  color: $text;
  &:focus { outline: none; border-color: $cyan; }
}
textarea { resize: vertical; font-family: $font-secondary; }
</style>
