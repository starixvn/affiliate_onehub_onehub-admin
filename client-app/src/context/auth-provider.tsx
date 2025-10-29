import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { tokenService } from '@/lib/auth/token-service'
import { authApi } from '@/features/auth/api/client'
import type { SignInRequest, AuthUser } from '@/features/auth/types'

type AuthProviderProps = {
  children: React.ReactNode
}

export type AuthContextValue = {
  isAuthenticated: boolean
  user: AuthUser | null
  isLoading: boolean
  isLoginPending: boolean
  isLogoutPending: boolean
  login: (credentials: SignInRequest) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const queryClient = useQueryClient()
  const { setAccessToken } = useAuthStore.getState().auth

  const loginMutation = useMutation({
    mutationFn: async (credentials: SignInRequest) => {
      const loginResponse = await authApi.login(credentials)

      if (loginResponse.errorCode === 0 && loginResponse.result) {
        const { accessToken } = loginResponse.result
        const userData = tokenService.extractUserData(accessToken)

        if (!userData) {
          throw new Error('Failed to extract user data from token')
        }

        const userId = tokenService.getUserIdFromToken(accessToken)
        tokenService.setAccessToken(accessToken)
        tokenService.setUserId(userId)

        return {
          ...userData,
          isAuthenticated: true,
        } as AuthUser
      }

      throw new Error(loginResponse.errorMessage || 'Login failed')
    },
    onSuccess: (userData) => {
      setUser(userData)
      setAccessToken(tokenService.getAccessToken())
      toast.success('Login successful')
    },
    onError: () => {
      setUser(null)
      tokenService.clearTokens()
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authApi.logout()
      setUser(null)
      setAccessToken(null)
      queryClient.clear()
    },
    onSuccess: () => {
      toast.success('Signed out successfully')
      window.location.href = '/sign-in'
    },
  })

  const login = async (credentials: SignInRequest): Promise<void> => {
    await loginMutation.mutateAsync(credentials)
  }

  const logout = async (): Promise<void> => {
    await logoutMutation.mutateAsync()
  }

  const attemptTokenRefresh = useCallback(async (): Promise<boolean> => {
    try {
      const response = await authApi.refreshToken(0)

      if (response.errorCode === 0 && response.result?.accessToken) {
        const { accessToken } = response.result
        const userData = tokenService.extractUserData(accessToken)

        if (!userData) {
          return false
        }

        const userId = tokenService.getUserIdFromToken(accessToken)
        tokenService.setAccessToken(accessToken)
        tokenService.setUserId(userId)

        setUser({ ...userData, isAuthenticated: true } as AuthUser)
        setAccessToken(accessToken)

        return true
      }

      return false
    } catch {
      return false
    }
  }, [setUser, setAccessToken])

  useEffect(() => {
    const initializeAuth = async () => {
      const token = tokenService.getAccessToken()

      if (token) {
        const userData = tokenService.extractUserData(token)
        if (userData) {
          setUser({ ...userData, isAuthenticated: true } as AuthUser)
          setAccessToken(token)
        }
      } else {
        const refreshed = await attemptTokenRefresh()
        if (!refreshed) {
          tokenService.clearTokens()
        }
      }

      setIsLoading(false)
    }

    initializeAuth()
  }, [setAccessToken, attemptTokenRefresh])

  const value: AuthContextValue = {
    isAuthenticated: !!user,
    user,
    isLoading,
    isLoginPending: loginMutation.isPending,
    isLogoutPending: logoutMutation.isPending,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
