import { z } from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { ComponentManagement } from '@/features/link-generator/component-management'

const searchSchema = z.object({
  pageIndex: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  deviceIds: z.string().optional(),
})

export const Route = createFileRoute(
  '/iframe/link-generator/component-management/'
)({
  component: ComponentManagement,
  validateSearch: searchSchema,
  beforeLoad: ({ search }) => {
    if (!search.status) {
      throw redirect({
        to: '/iframe/link-generator/component-management',
        search: {
          ...search,
          status: '1',
        },
        replace: true,
      })
    }
  },
})
