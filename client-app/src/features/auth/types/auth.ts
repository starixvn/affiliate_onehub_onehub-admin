import type { IAxiosResponse } from '@/lib/types/common'

export interface SignInRequest {
  username: string
  password: string
}

export interface LoginResponseData {
  accessToken: string
  refreshToken: string
  expiresAt: string
  userId: number
  userName: string
  fullName: string
}

export type LoginResponse = IAxiosResponse<LoginResponseData>

export interface RefreshTokenRequest {
  userId: number
}

export interface RefreshTokenResponseData {
  accessToken: string
  refreshToken: string
  expiresAt: string
}

export type RefreshTokenResponse = IAxiosResponse<RefreshTokenResponseData>

export interface GetUserMenuRequest {
  lang: string
  siteId: number
}

export interface MenuItemData {
  id: string
  name: string
  path?: string
  icon?: string
  children?: MenuItemData[]
  permissions?: string[]
}

export interface GetUserMenuResponseData {
  menu?: MenuItemData[]
}

export type GetUserMenuResponse = IAxiosResponse<GetUserMenuResponseData>

export interface AuthUser {
  userId: string
  username: string
  email: string
  role: string[]
  avatar?: string
  isAuthenticated: boolean
}
