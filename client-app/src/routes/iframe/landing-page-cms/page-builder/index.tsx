import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PageBuilder } from '@/features/landing-page-cms/page-builder'

const searchSchema = z.object({
  mode: z.enum(['create', 'edit', 'duplicate']).optional(),
  pageId: z.string().optional(),
})

export const Route = createFileRoute('/iframe/landing-page-cms/page-builder/')({
  component: PageBuilder,
  validateSearch: searchSchema,
})
