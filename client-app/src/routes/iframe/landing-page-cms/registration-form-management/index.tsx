import { createFileRoute } from '@tanstack/react-router'
import { RegisterFormManagement } from '@/features/landing-page-cms/registration-form-management'

export const Route = createFileRoute(
  '/iframe/landing-page-cms/registration-form-management/'
)({
  component: RegisterFormManagement,
})

