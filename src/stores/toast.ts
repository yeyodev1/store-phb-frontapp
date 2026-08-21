import { defineStore } from 'pinia'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

let counter = 0

export const useToastStore = defineStore('toast', {
  state: () => ({
    items: [] as Toast[],
  }),

  actions: {
    push(message: string, type: Toast['type'] = 'success', timeout = 3200) {
      const id = ++counter
      this.items.push({ id, message, type })
      setTimeout(() => this.dismiss(id), timeout)
    },
    success(message: string) {
      this.push(message, 'success')
    },
    error(message: string) {
      this.push(message, 'error', 4200)
    },
    info(message: string) {
      this.push(message, 'info')
    },
    dismiss(id: number) {
      this.items = this.items.filter((t) => t.id !== id)
    },
  },
})
