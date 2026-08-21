import APIBase from './httpBase'
import type { Product, Category, Pagination } from '@/types'

interface ProductListResponse {
  data: Product[]
  pagination: Pagination
}

interface ProductDetailResponse {
  data: Product
  related: Product[]
}

export interface ProductQuery {
  page?: number
  limit?: number
  search?: string
  category?: string
  featured?: boolean
  sort?: string
}

class CatalogService extends APIBase {
  async listProducts(params: ProductQuery = {}): Promise<ProductListResponse> {
    const q = new URLSearchParams()
    if (params.page) q.set('page', String(params.page))
    if (params.limit) q.set('limit', String(params.limit))
    if (params.search) q.set('search', params.search)
    if (params.category) q.set('category', params.category)
    if (params.featured) q.set('featured', 'true')
    if (params.sort) q.set('sort', params.sort)
    const qs = q.toString()
    const res = await this.get<ProductListResponse>(`products${qs ? `?${qs}` : ''}`)
    return res.data
  }

  async getProduct(slug: string): Promise<ProductDetailResponse> {
    const res = await this.get<ProductDetailResponse>(`products/${slug}`)
    return res.data
  }

  async listCategories(): Promise<Category[]> {
    const res = await this.get<{ data: Category[] }>('categories')
    return res.data.data
  }
}

export const catalogService = new CatalogService()
