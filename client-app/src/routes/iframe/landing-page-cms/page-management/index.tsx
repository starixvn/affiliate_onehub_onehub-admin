import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { PageManagement } from '@/features/landing-page-cms/page-management'

const searchSchema = z.object({
  pageIndex: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().optional(),
  status: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  countryCode: z.string().optional(),
  languageCode: z.string().optional(),
  preset: z.string().optional(),
})

export const Route = createFileRoute('/iframe/landing-page-cms/page-management/')({
  component: PageManagement,
  validateSearch: searchSchema,
})
