import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { authApi } from '@/features/auth/api/client'
import { tokenService } from '@/lib/auth/token-service'
import { useAuthStore } from '@/stores/auth-store'
import { useEffect, useRef, useState } from 'react'

const searchSchema = z.object({
  target: z.string().optional(),
})

export const Route = createFileRoute('/sso')({
  component: SsoPage,
  validateSearch: searchSchema,
})

function SsoPage() {
  const { target } = Route.useSearch()
  const setAccessToken = useAuthStore((state) => state.auth.setAccessToken)
  const setUser = useAuthStore((state) => state.auth.setUser)
  const navigate = Route.useNavigate()
  const [error, setError] = useState<string | null>(null)
  const redirectTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const handleSso = async () => {
      try {
        const response = await authApi.sso()

        if (response.errorCode === 0 && response.data) {
          const { accessToken } = response.data

          setAccessToken(accessToken)

          const userData = tokenService.extractUserData(accessToken)
          if (userData) {
            setUser({
              ...userData,
              isAuthenticated: true,
            })
          }

          if (!target) {
            navigate({ to: '/404' })
            return
          }

          const targetPath = `/iframe/${target}`
          navigate({ to: targetPath })
        } else {
          setError(response.errorMessage || 'SSO authentication failed')
          redirectTimeoutRef.current = window.setTimeout(() => navigate({ to: '/401' }), 1500)
        }
      } catch {
        navigate({ to: '/401' })
      }
    }

    handleSso()
    return () => { if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current)}
  }, [target, setAccessToken, setUser, navigate])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-destructive">
            Authentication Failed
          </h1>
          <p className="mt-2 text-muted-foreground">{error}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Redirecting to error page...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="text-muted-foreground">Authenticating...</p>
      </div>
    </div>
  )
}
