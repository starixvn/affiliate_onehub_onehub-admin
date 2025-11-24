import { apiClient } from '@/lib/api/client'
import type {
  SignInRequest,
  LoginResponse,
  RefreshTokenResponse,
  UserProfileResponse,
} from '../types'

export const authApi = {
  async login(credentials: SignInRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      '/auth/login',
      credentials
    )
    return response.data
  },

  async refreshToken(): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh')
    return response.data
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },

  async getMe(): Promise<UserProfileResponse> {
    const response = await apiClient.get<UserProfileResponse>('/auth/me')
    return response.data
  },

  async sso(): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/sso')
    return response.data
  },
}
