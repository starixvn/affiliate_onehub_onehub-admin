import { createFileRoute } from '@tanstack/react-router'
import { PageManagement } from '@/features/landing-page-cms/page-management'

export const Route = createFileRoute('/iframe/landing-page-cms/page-management/')({
  component: PageManagement,
})
