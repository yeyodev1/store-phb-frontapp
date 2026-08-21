export interface ApiError {
  status: number
  message: string
  data?: unknown
}

export interface Spec {
  label: string
  value: string
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
