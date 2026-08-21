import APIBase from './httpBase'
import type { Order, CustomerInfo } from '@/types'

export interface CheckoutItem {
  productId: string
  quantity: number
}

class OrdersService extends APIBase {
  async create(payload: {
    items: CheckoutItem[]
    customer: CustomerInfo
  }): Promise<Order> {
    const res = await this.post<{ data: Order }>('orders', payload)
    return res.data.data
  }

  async mine(): Promise<Order[]> {
    const res = await this.get<{ data: Order[] }>('orders/mine')
    return res.data.data
  }

  async getByNumber(orderNumber: string): Promise<Order> {
    const res = await this.get<{ data: Order }>(`orders/${orderNumber}`)
    return res.data.data
  }
}

export const ordersService = new OrdersService()
