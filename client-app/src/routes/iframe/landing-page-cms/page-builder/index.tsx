import { createFileRoute } from '@tanstack/react-router'
import { PageBuilder } from '@/features/landing-page-cms/page-builder'

export const Route = createFileRoute('/iframe/landing-page-cms/page-builder/')({
  component: PageBuilder,
})
