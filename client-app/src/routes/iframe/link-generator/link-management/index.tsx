import { createFileRoute } from '@tanstack/react-router'
import { LinkManagement } from '@/features/link-generator/link-management'

export const Route = createFileRoute('/iframe/link-generator/link-management/')(
  {
    component: LinkManagement,
  }
)
