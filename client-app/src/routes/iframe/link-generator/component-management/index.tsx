import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { ComponentManagement } from '@/features/link-generator/component-management'

const searchSchema = z.object({
  pageIndex: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  deviceType: z.string().optional(),
})

export const Route = createFileRoute(
  '/iframe/link-generator/component-management/'
)({
  component: ComponentManagement,
  validateSearch: searchSchema,
})
