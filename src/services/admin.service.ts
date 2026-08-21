import APIBase from './httpBase'
import type { Product, Category, Order, AuthUser, Pagination, OrderStatus } from '@/types'

export interface AdminStats {
  totalOrders: number
  pendingOrders: number
  revenue: number
}

export interface AdminUserRow extends AuthUser {
  _id: string
  isActive: boolean
  phone?: string
  createdAt: string
}

class AdminService extends APIBase {
  // Stats
  async stats(): Promise<AdminStats> {
    const res = await this.get<{ data: AdminStats }>('admin/stats')
    return res.data.data
  }

  // Products
  async listProducts(search = ''): Promise<{ data: Product[]; pagination: Pagination }> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : ''
    const res = await this.get<{ data: Product[]; pagination: Pagination }>(`admin/products${qs}`)
    return res.data
  }
  async getProduct(id: string): Promise<Product> {
    const res = await this.get<{ data: Product }>(`admin/products/${id}`)
    return res.data.data
  }
  async createProduct(payload: Partial<Product>): Promise<Product> {
    const res = await this.post<{ data: Product }>('admin/products', payload)
    return res.data.data
  }
  async updateProduct(id: string, payload: Partial<Product>): Promise<Product> {
    const res = await this.put<{ data: Product }>(`admin/products/${id}`, payload)
    return res.data.data
  }
  async deleteProduct(id: string): Promise<void> {
    await this.delete(`admin/products/${id}`)
  }

  // Categories
  async listCategories(): Promise<Category[]> {
    const res = await this.get<{ data: Category[] }>('admin/categories')
    return res.data.data
  }
  async createCategory(payload: Partial<Category>): Promise<Category> {
    const res = await this.post<{ data: Category }>('admin/categories', payload)
    return res.data.data
  }
  async updateCategory(id: string, payload: Partial<Category>): Promise<Category> {
    const res = await this.put<{ data: Category }>(`admin/categories/${id}`, payload)
    return res.data.data
  }
  async deleteCategory(id: string): Promise<void> {
    await this.delete(`admin/categories/${id}`)
  }

  // Orders
  async listOrders(params: { status?: string; search?: string } = {}): Promise<{
    data: Order[]
    pagination: Pagination
  }> {
    const q = new URLSearchParams()
    if (params.status) q.set('status', params.status)
    if (params.search) q.set('search', params.search)
    const qs = q.toString()
    const res = await this.get<{ data: Order[]; pagination: Pagination }>(
      `admin/orders${qs ? `?${qs}` : ''}`,
    )
    return res.data
  }
  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const res = await this.put<{ data: Order }>(`admin/orders/${id}/status`, { status })
    return res.data.data
  }

  // Users
  async listUsers(search = ''): Promise<{ data: AdminUserRow[]; pagination: Pagination }> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : ''
    const res = await this.get<{ data: AdminUserRow[]; pagination: Pagination }>(`admin/users${qs}`)
    return res.data
  }
  async createUser(payload: Record<string, unknown>): Promise<AdminUserRow> {
    const res = await this.post<{ data: AdminUserRow }>('admin/users', payload)
    return res.data.data
  }
  async updateUser(id: string, payload: Record<string, unknown>): Promise<AdminUserRow> {
    const res = await this.put<{ data: AdminUserRow }>(`admin/users/${id}`, payload)
    return res.data.data
  }
  async deleteUser(id: string): Promise<void> {
    await this.delete(`admin/users/${id}`)
  }
}

export const adminService = new AdminService()
