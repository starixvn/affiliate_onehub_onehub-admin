import {
  getLocalStorageItem,
  setLocalStorageItem,
  removeLocalStorageItem,
} from '@/lib/local-storage'

interface TokenPayload {
  sub?: string
  unique_name?: string
  email?: string
  nameid?: string
  name?: string
  role?: string | string[]
  avatar?: string
  exp: number
}

const ACCESS_TOKEN_KEY = 'accessToken'
const USER_ID_KEY = 'userId'

export const tokenService = {
  getAccessToken(): string | null {
    return getLocalStorageItem(ACCESS_TOKEN_KEY)
  },

  setAccessToken(token: string): void {
    setLocalStorageItem(ACCESS_TOKEN_KEY, token)
  },

  getUserId(): number | null {
    const userId = getLocalStorageItem(USER_ID_KEY)
    return userId ? parseInt(userId, 10) : null
  },

  setUserId(userId: number): void {
    setLocalStorageItem(USER_ID_KEY, userId.toString())
  },

  clearTokens(): void {
    removeLocalStorageItem(ACCESS_TOKEN_KEY)
    removeLocalStorageItem(USER_ID_KEY)
  },

  decodeToken(token: string): TokenPayload | null {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch {
      return null
    }
  },

  getUserIdFromToken(token: string): number {
    const payload = this.decodeToken(token)
    if (!payload) return 0

    return parseInt(payload.sub || payload.nameid || '', 10) || 0
  },

  extractUserData(token: string) {
    const payload = this.decodeToken(token)
    if (!payload) return null

    const role = payload.role || []

    return {
      userId: payload.sub || payload.nameid || '',
      username: payload.unique_name || payload.name || '',
      email: payload.email || '',
      role: Array.isArray(role) ? role : [role],
      avatar: payload.avatar,
    }
  },
}
