import { defineStore } from 'pinia'
import { authService } from '@/services/auth.service'
import type { AuthUser } from '@/types'

export interface UserState {
  id: string | null
  name: string | null
  email: string | null
  accountType: 'admin' | 'user' | null
  isAuthenticated: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: null,
    name: null,
    email: null,
    accountType: null,
    isAuthenticated: false,
  }),

  getters: {
    isAdmin: (s) => s.accountType === 'admin',
    initials: (s) =>
      (s.name || 'U')
        .split(' ')
        .slice(0, 2)
        .map((p) => p.charAt(0).toUpperCase())
        .join(''),
  },

  actions: {
    hydrate() {
      const token = localStorage.getItem('access_token')
      this.isAuthenticated = !!token
      this.id = localStorage.getItem('user_id')
      this.name = localStorage.getItem('user_name')
      this.email = localStorage.getItem('user_email')
      this.accountType = (localStorage.getItem('user_type') as 'admin' | 'user') || null
    },

    persist(token: string, user: AuthUser) {
      try {
        localStorage.setItem('access_token', token)
        localStorage.setItem('user_id', user.id)
        localStorage.setItem('user_name', user.name)
        localStorage.setItem('user_email', user.email)
        localStorage.setItem('user_type', user.accountType)
      } catch {}
      this.id = user.id
      this.name = user.name
      this.email = user.email
      this.accountType = user.accountType
      this.isAuthenticated = true
    },

    async login(email: string, password: string) {
      const { token, user } = await authService.login(email, password)
      this.persist(token, user)
      return user
    },

    async register(payload: { name: string; email: string; password: string; phone?: string }) {
      const { token, user } = await authService.register(payload)
      this.persist(token, user)
      return user
    },

    async refresh() {
      if (!localStorage.getItem('access_token')) return
      try {
        const user = await authService.me()
        this.persist(localStorage.getItem('access_token') as string, user)
      } catch {
        this.clear()
      }
    },

    clear() {
      this.id = null
      this.name = null
      this.email = null
      this.accountType = null
      this.isAuthenticated = false
      try {
        ;['access_token', 'user_id', 'user_name', 'user_email', 'user_type'].forEach((k) =>
          localStorage.removeItem(k),
        )
      } catch {}
    },
  },
})
