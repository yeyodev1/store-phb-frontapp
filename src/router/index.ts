import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  // ── Storefront ──────────────────────────────────────────────────────────
  { path: '/', name: 'Home', component: () => import('@/views/HomeView.vue'), meta: { title: 'Agua Kangen' } },
  { path: '/tienda', name: 'Catalog', component: () => import('@/views/CatalogView.vue'), meta: { title: 'Tienda' } },
  { path: '/producto/:slug', name: 'Product', component: () => import('@/views/ProductView.vue'), meta: { title: 'Producto' } },
  { path: '/carrito', name: 'Cart', component: () => import('@/views/CartView.vue'), meta: { title: 'Carrito' } },
  { path: '/checkout', name: 'Checkout', component: () => import('@/views/CheckoutView.vue'), meta: { title: 'Checkout' } },
  { path: '/pedido/:orderNumber', name: 'OrderConfirmation', component: () => import('@/views/OrderConfirmationView.vue'), meta: { title: 'Pedido confirmado' } },
  { path: '/beneficios', name: 'Benefits', component: () => import('@/views/BenefitsView.vue'), meta: { title: 'Beneficios' } },

  // ── Auth ────────────────────────────────────────────────────────────────
  { path: '/login', name: 'Login', component: () => import('@/views/LoginView.vue'), meta: { title: 'Iniciar sesión' } },
  { path: '/registro', name: 'Register', component: () => import('@/views/RegisterView.vue'), meta: { title: 'Crear cuenta' } },

  // ── Customer portal ───────────────────────────────────────────────────────
  { path: '/cuenta', name: 'Account', component: () => import('@/views/account/AccountView.vue'), meta: { title: 'Mi cuenta', requiresAuth: true } },
  { path: '/cuenta/pedidos', name: 'MyOrders', component: () => import('@/views/account/MyOrdersView.vue'), meta: { title: 'Mis pedidos', requiresAuth: true } },

  // ── Admin portal ──────────────────────────────────────────────────────────
  { path: '/admin', name: 'AdminDashboard', component: () => import('@/views/admin/AdminDashboardView.vue'), meta: { title: 'Dashboard', admin: true, requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/productos', name: 'AdminProducts', component: () => import('@/views/admin/AdminProductsView.vue'), meta: { title: 'Productos', admin: true, requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/productos/nuevo', name: 'AdminProductNew', component: () => import('@/views/admin/AdminProductFormView.vue'), meta: { title: 'Nuevo producto', admin: true, requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/productos/:id', name: 'AdminProductEdit', component: () => import('@/views/admin/AdminProductFormView.vue'), meta: { title: 'Editar producto', admin: true, requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/categorias', name: 'AdminCategories', component: () => import('@/views/admin/AdminCategoriesView.vue'), meta: { title: 'Categorías', admin: true, requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/pedidos', name: 'AdminOrders', component: () => import('@/views/admin/AdminOrdersView.vue'), meta: { title: 'Pedidos', admin: true, requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/usuarios', name: 'AdminUsers', component: () => import('@/views/admin/AdminUsersView.vue'), meta: { title: 'Usuarios', admin: true, requiresAuth: true, requiresAdmin: true } },

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/NotFoundView.vue'), meta: { title: 'No encontrado' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { left: 0, top: 0, behavior: 'smooth' }
  },
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('access_token')
  const accountType = localStorage.getItem('user_type')

  if (to.meta.requiresAuth && !token) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }
  if (to.meta.requiresAdmin && accountType !== 'admin') {
    return next({ path: '/' })
  }
  if ((to.path === '/login' || to.path === '/registro') && token) {
    return next({ path: accountType === 'admin' ? '/admin' : '/cuenta' })
  }

  document.title = to.meta.title ? `${to.meta.title} · PHB Agua Kangen` : 'PHB Agua Kangen'
  next()
})

export default router
