import APIBase from './httpBase'
import type { AuthUser } from '@/types'

interface AuthResponse {
  token: string
  user: AuthUser
}

class AuthService extends APIBase {
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await this.post<AuthResponse>('auth/login', { email, password })
    return res.data
  }

  async register(payload: {
    name: string
    email: string
    password: string
    phone?: string
  }): Promise<AuthResponse> {
    const res = await this.post<AuthResponse>('auth/register', payload)
    return res.data
  }

  async me(): Promise<AuthUser> {
    const res = await this.get<{ data: AuthUser }>('auth/me')
    return res.data.data
  }

  async updateMe(payload: Record<string, unknown>): Promise<AuthUser> {
    const res = await this.put<{ data: AuthUser }>('auth/me', payload)
    return res.data.data
  }
}

export const authService = new AuthService()
