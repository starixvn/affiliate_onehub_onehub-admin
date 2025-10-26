import { create } from 'zustand'
import { tokenService } from '@/lib/auth/token-service'
import type { AuthUser } from '@/features/auth/types'

interface AuthState {
  auth: {
    user: AuthUser | null
    accessToken: string | null
    setUser: (user: AuthUser | null) => void
    setAccessToken: (token: string | null) => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => ({
  auth: {
    user: null,
    accessToken: tokenService.getAccessToken(),
    setUser: (user) =>
      set((state) => ({ ...state, auth: { ...state.auth, user } })),
    setAccessToken: (token) => {
      if (token) {
        tokenService.setAccessToken(token)
      } else {
        tokenService.clearTokens()
      }
      return set((state) => ({
        ...state,
        auth: { ...state.auth, accessToken: token },
      }))
    },
    reset: () => {
      tokenService.clearTokens()
      return set((state) => ({
        ...state,
        auth: { ...state.auth, user: null, accessToken: null },
      }))
    },
  },
}))
