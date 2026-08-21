<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { adminService, type AdminUserRow } from '@/services/admin.service'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { formatDate } from '@/composables/useFormat'

const me = useUserStore()
const toast = useToastStore()

const users = ref<AdminUserRow[]>([])
const loading = ref(true)
const search = ref('')
const showModal = ref(false)
const editing = ref<AdminUserRow | null>(null)

const form = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  accountType: 'user' as 'user' | 'admin',
  isActive: true,
})

async function load() {
  loading.value = true
  try {
    users.value = (await adminService.listUsers(search.value)).data
  } catch {
    users.value = []
  } finally {
    loading.value = false
  }
}

let timer: number
function onSearch() {
  clearTimeout(timer)
  timer = window.setTimeout(load, 300)
}

function openNew() {
  editing.value = null
  Object.assign(form, { name: '', email: '', phone: '', password: '', accountType: 'user', isActive: true })
  showModal.value = true
}
function openEdit(u: AdminUserRow) {
  editing.value = u
  Object.assign(form, {
    name: u.name,
    email: u.email,
    phone: u.phone || '',
    password: '',
    accountType: u.accountType,
    isActive: u.isActive,
  })
  showModal.value = true
}

async function save() {
  if (!form.name || !form.email || (!editing.value && !form.password)) {
    toast.error('Completa nombre, email y contraseña')
    return
  }
  try {
    if (editing.value) {
      const payload: Record<string, unknown> = {
        name: form.name,
        phone: form.phone,
        accountType: form.accountType,
        isActive: form.isActive,
      }
      if (form.password) payload.password = form.password
      await adminService.updateUser(editing.value._id, payload)
      toast.success('Usuario actualizado')
    } else {
      await adminService.createUser({ ...form })
      toast.success('Usuario creado')
    }
    showModal.value = false
    load()
  } catch (e) {
    toast.error((e as { message?: string })?.message || 'No se pudo guardar')
  }
}

async function remove(u: AdminUserRow) {
  if (u._id === me.id) {
    toast.error('No puedes eliminar tu propia cuenta')
    return
  }
  if (!confirm(`¿Eliminar a ${u.name}?`)) return
  try {
    await adminService.deleteUser(u._id)
    toast.success('Usuario eliminado')
    load()
  } catch {
    toast.error('No se pudo eliminar')
  }
}

onMounted(load)
</script>

<template>
  <div class="au">
    <header class="au__head">
      <div>
        <h1>Usuarios</h1>
        <p>Gestión de clientes y administradores</p>
      </div>
      <button class="btn btn--primary" @click="openNew"><i class="fa-solid fa-user-plus"></i> Nuevo usuario</button>
    </header>

    <div class="au__search">
      <input v-model="search" @input="onSearch" type="search" placeholder="Buscar por nombre o email…" />
    </div>

    <div v-if="loading" class="au__muted">Cargando…</div>
    <div v-else-if="!users.length" class="au__muted">No hay usuarios.</div>

    <div v-else class="au__list">
      <article v-for="u in users" :key="u._id" class="au__row">
        <span class="au__avatar" :class="{ admin: u.accountType === 'admin' }">
          {{ (u.name || 'U').charAt(0).toUpperCase() }}
        </span>
        <div class="au__info">
          <strong>{{ u.name }}</strong>
          <span>{{ u.email }}</span>
        </div>
        <span class="chip" :class="u.accountType === 'admin' ? 'chip--cyan' : ''">
          {{ u.accountType === 'admin' ? 'Admin' : 'Cliente' }}
        </span>
        <span class="chip" :class="u.isActive ? 'chip--stock' : ''">
          {{ u.isActive ? 'Activo' : 'Inactivo' }}
        </span>
        <span class="au__date">{{ formatDate(u.createdAt) }}</span>
        <div class="au__actions">
          <button class="btn btn--ghost btn--sm" @click="openEdit(u)"><i class="fa-solid fa-pen"></i> Editar</button>
          <button class="au__del" @click="remove(u)" :disabled="u._id === me.id" aria-label="Eliminar"><i class="fa-solid fa-trash"></i></button>
        </div>
      </article>
    </div>

    <!-- Modal -->
    <teleport to="body">
      <transition name="fade">
        <div v-if="showModal" class="modal__overlay" @click="showModal = false" />
      </transition>
      <transition name="pop">
        <div v-if="showModal" class="modal" role="dialog">
          <header class="modal__head">
            <h3>{{ editing ? 'Editar usuario' : 'Nuevo usuario' }}</h3>
            <button class="modal__close" @click="showModal = false" aria-label="Cerrar"><i class="fa-solid fa-xmark"></i></button>
          </header>
          <div class="modal__body">
            <label class="field"><span>Nombre</span><input v-model="form.name" type="text" /></label>
            <label class="field"><span>Email</span><input v-model="form.email" type="email" :disabled="!!editing" /></label>
            <label class="field"><span>Teléfono</span><input v-model="form.phone" type="tel" /></label>
            <label class="field">
              <span>Contraseña {{ editing ? '(dejar en blanco = no cambiar)' : '' }}</span>
              <input v-model="form.password" type="password" :placeholder="editing ? '••••••' : 'Mínimo 6 caracteres'" />
            </label>
            <div class="field-row">
              <label class="field">
                <span>Rol</span>
                <select v-model="form.accountType">
                  <option value="user">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
              </label>
              <label class="field field--check">
                <span>Estado</span>
                <label class="au__toggle"><input v-model="form.isActive" type="checkbox" /> Activo</label>
              </label>
            </div>
          </div>
          <footer class="modal__foot">
            <button class="btn btn--ghost" @click="showModal = false">Cancelar</button>
            <button class="btn btn--primary" @click="save">{{ editing ? 'Guardar' : 'Crear' }}</button>
          </footer>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<style scoped lang="scss">
.au {
  display: flex;
  flex-direction: column;
  gap: 1.3rem;

  &__head { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; h1 { font-size: 1.6rem; } p { color: $text-secondary; } }
  &__search input { width: 100%; max-width: 380px; border: 1.5px solid $border-strong; border-radius: 999px; padding: 0.7rem 1.1rem; background: $white; &:focus { outline: none; border-color: $cyan; } }
  &__muted { color: $text-secondary; padding: 2rem; text-align: center; @include card; }

  &__list { display: flex; flex-direction: column; gap: 0.6rem; }
  &__row { @include card; padding: 0.8rem 1.1rem; display: flex; align-items: center; gap: 0.9rem; flex-wrap: wrap; }
  &__avatar {
    width: 44px; height: 44px;
    border-radius: 50%;
    background: $surface-3;
    color: $navy;
    display: flex; align-items: center; justify-content: center;
    font-family: $font-accent; font-weight: 700;
    flex-shrink: 0;
    &.admin { background: $grad-navy; color: $accent; }
  }
  &__info { flex: 1 1 160px; display: flex; flex-direction: column; strong { font-family: $font-principal; } span { color: $text-secondary; font-size: 0.85rem; } }
  &__date { color: $text-secondary; font-size: 0.82rem; }
  &__actions { display: flex; align-items: center; gap: 0.4rem; margin-left: auto; }
  &__del { width: 38px; height: 38px; border-radius: 10px; &:hover:not(:disabled) { background: rgba(239,68,68,0.1); } &:disabled { opacity: 0.35; cursor: not-allowed; } }
  &__toggle { display: flex; align-items: center; gap: 0.5rem; input { width: 18px; height: 18px; accent-color: $cyan; } }
}

.modal {
  position: fixed;
  z-index: 110;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(520px, 92vw);
  max-height: 90vh;
  overflow-y: auto;
  background: $white;
  border-radius: 22px;
  box-shadow: $shadow-lg;

  &__overlay { position: fixed; inset: 0; z-index: 100; background: rgba(7,16,35,0.5); backdrop-filter: blur(2px); }
  &__head { display: flex; justify-content: space-between; align-items: center; padding: 1.3rem 1.5rem; border-bottom: 1px solid $border; }
  &__close { width: 36px; height: 36px; border-radius: 9px; color: $text-secondary; &:hover { background: $surface-2; } }
  &__body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
  &__foot { display: flex; justify-content: flex-end; gap: 0.7rem; padding: 1.2rem 1.5rem; border-top: 1px solid $border; }
}

.field {
  display: flex; flex-direction: column; gap: 0.4rem; flex: 1;
  span { font-size: 0.85rem; font-weight: 600; }
  input, select { border: 1.5px solid $border-strong; border-radius: 12px; padding: 0.7rem 0.85rem; background: $white; &:focus { outline: none; border-color: $cyan; } &:disabled { background: $surface-2; color: $text-secondary; } }
  &--check { justify-content: flex-end; }
}
.field-row { display: flex; flex-wrap: wrap; gap: 1rem; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.pop-enter-active, .pop-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: translate(-50%, -46%) scale(0.96); }
</style>
