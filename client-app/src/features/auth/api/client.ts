import { apiClient } from '@/lib/api/client'
import type {
  SignInRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '../types'

export const authApi = {
  async login(credentials: SignInRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      '/auth/login',
      credentials
    )
    return response.data
  },

  async refreshToken(userId: number): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>(
      '/auth/refresh',
      { userId } as RefreshTokenRequest
    )
    return response.data
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },
}
