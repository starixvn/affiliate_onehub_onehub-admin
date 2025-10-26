import { createFileRoute } from '@tanstack/react-router'
import { ComponentManagement } from '@/features/link-generator/component-management'

export const Route = createFileRoute(
  '/iframe/link-generator/component-management/'
)({
  component: ComponentManagement,
})
