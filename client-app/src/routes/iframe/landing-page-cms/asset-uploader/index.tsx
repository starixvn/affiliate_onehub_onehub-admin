import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { AssetUploader } from '@/features/landing-page-cms/asset-uploader'

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
  '/iframe/landing-page-cms/asset-uploader/'
)({
  component: AssetUploader,
  validateSearch: searchSchema,
})
