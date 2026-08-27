export interface ApiError {
  status: number
  message: string
  data?: unknown
}

export interface Spec {
  label: string
  value: string
}

/** Define cómo se compra y cómo se entrega un producto. */
export type ProductType =
  | 'physical'
  | 'digital'
  | 'assessment'
  | 'program'
  | 'clinical'

export type DeliveryMethod =
  | 'shipping'
  | 'download'
  | 'platform-access'
  | 'external-assessment'
  | 'scheduled-consultation'

/** Los tres niveles de exhibición del catálogo. */
export type DisplayTier = 'comienza-aqui' | 'populares' | 'nuevos'

/** Ejes por los que el visitante navega su preocupación. */
export type Theme =
  | 'biomarcadores'
  | 'prevencion'
  | 'comportamiento'
  | 'regeneracion'
  | 'longevidad'
  | 'innovacion'

export interface DigitalAsset {
  url: string
  fileName?: string
  mimeType?: string
  sizeBytes?: number
}

export interface Product {
  _id: string
  name: string
  slug: string
  modelCode?: string
  shortDescription?: string
  description?: string
  benefits: string[]
  specs: Spec[]
  price: number
  compareAtPrice?: number
  currency: string
  images: string[]
  categorySlug?: string
  stock: number
  featured: boolean
  isActive: boolean
  rating: number
  tags: string[]
  createdAt?: string
  updatedAt?: string

  // --- Naturaleza del producto ---
  productType: ProductType
  deliveryMethod: DeliveryMethod

  /** Los cuatro datos que toda ficha muestra siempre. */
  format?: string
  whatYouLearn?: string
  idealFor?: string
  timeRequired?: string

  // --- Entrega digital ---
  digitalAsset?: DigitalAsset
  accessUrl?: string
  accessDurationDays?: number | null

  /** Corta el carrito: los programas clínicos se evalúan, no se compran. */
  requiresEvaluation: boolean
  evaluationUrl?: string
  ctaLabel?: string
  isLeadMagnet: boolean
  /** El negocio todavía no fija el precio: se muestra "Precio a confirmar". */
  priceOnRequest?: boolean

  // --- Taxonomía ---
  categorySlugs: string[]
  themes: Theme[]
  displayTier?: DisplayTier

  // --- Cobro ---
  stripeProductId?: string
  stripePriceId?: string
  subscription?: {
    isSubscription: boolean
    interval?: 'month' | 'year'
  }

  // Virtuales que envía el backend
  isPurchasable?: boolean
  isDigital?: boolean
  resolvedCtaLabel?: string
}

export interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  order: number
  isActive: boolean
}

export interface CartLine {
  productId: string
  slug: string
  name: string
  modelCode?: string
  price: number
  image?: string
  quantity: number
}

export interface OrderItem {
  product?: string
  name: string
  model?: string
  image?: string
  price: number
  quantity: number
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface CustomerInfo {
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  province?: string
  country?: string
  notes?: string
}

export interface Order {
  _id: string
  orderNumber: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  currency: string
  status: OrderStatus
  customer: CustomerInfo
  paymentMethod: string
  createdAt: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  accountType: 'admin' | 'user'
}

export interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}
