import type { IAxiosResponse } from '@/lib/api/types'

export interface SignInRequest {
  username: string
  password: string
}

export interface LoginResponseData {
  accessToken: string
  refreshToken: string
}

export type LoginResponse = IAxiosResponse<LoginResponseData>

export interface RefreshTokenResponseData {
  accessToken: string
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
