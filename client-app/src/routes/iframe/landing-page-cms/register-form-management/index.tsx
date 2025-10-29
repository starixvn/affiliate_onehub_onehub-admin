import { createFileRoute } from '@tanstack/react-router'
import { RegisterFormManagement } from '@/features/landing-page-cms/register-form-management'

export const Route = createFileRoute(
  '/iframe/landing-page-cms/register-form-management/'
)({
  component: RegisterFormManagement,
})
