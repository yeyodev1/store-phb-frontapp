import { defineStore } from 'pinia'
import type { CartLine, Product } from '@/types'
import { canAddToCart } from '@/utils/product'

const STORAGE_KEY = 'phb_cart'

function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartLine[]) : []
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    lines: load() as CartLine[],
    isOpen: false,
  }),

  getters: {
    count: (s) => s.lines.reduce((n, l) => n + l.quantity, 0),
    subtotal: (s) => s.lines.reduce((n, l) => n + l.price * l.quantity, 0),
    isEmpty: (s) => s.lines.length === 0,
  },

  actions: {
    save() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.lines))
      } catch {}
    },

    /**
     * Última red de seguridad: si el producto requiere evaluación (clínico)
     * o es un lead magnet gratuito, nunca entra al carrito.
     */
    add(product: Product, quantity = 1): boolean {
      if (!canAddToCart(product)) return false

      const existing = this.lines.find((l) => l.productId === product._id)
      if (existing) {
        existing.quantity += quantity
      } else {
        this.lines.push({
          productId: product._id,
          slug: product.slug,
          name: product.name,
          modelCode: product.modelCode,
          price: product.price,
          image: product.images?.[0],
          quantity,
        })
      }
      this.save()
      this.isOpen = true
      return true
    },

    setQuantity(productId: string, quantity: number) {
      const line = this.lines.find((l) => l.productId === productId)
      if (!line) return
      line.quantity = Math.max(1, quantity)
      this.save()
    },

    remove(productId: string) {
      this.lines = this.lines.filter((l) => l.productId !== productId)
      this.save()
    },

    clear() {
      this.lines = []
      this.save()
    },

    open() {
      this.isOpen = true
    },
    close() {
      this.isOpen = false
    },
  },
})
