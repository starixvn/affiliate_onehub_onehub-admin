import { z } from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { tokenService } from '@/lib/auth/token-service'
import { SignIn } from '@/features/auth/sign-in'

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/sign-in')({
  beforeLoad: async () => {
    const token = tokenService.getAccessToken()

    if (token) {
      throw redirect({ to: '/' })
    }
  },
  component: SignIn,
  validateSearch: searchSchema,
})
