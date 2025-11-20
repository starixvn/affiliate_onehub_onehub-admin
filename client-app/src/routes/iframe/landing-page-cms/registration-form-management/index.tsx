import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { RegisterFormManagement } from '@/features/landing-page-cms/registration-form-management'

const searchSchema = z.object({
  mediaName: z.string().optional(),
  moduleIds: z.string().optional(),
  moduleIdsAuto: z.boolean().optional(),
  targetCountrycodes: z.string().optional(),
  languageCodes: z.string().optional(),
  status: z.number().optional(),
  mediaId: z.number().optional(),
  pageIndex: z.number().optional(),
  pageSize: z.number().optional(),
})

export const Route = createFileRoute(
  '/iframe/landing-page-cms/registration-form-management/'
)({
  component: RegisterFormManagement,
  validateSearch: searchSchema,
})
