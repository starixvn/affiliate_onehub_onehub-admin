import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PageBuilder } from '@/features/landing-page-cms/page-builder'

const searchSchema = z.object({
  pageId: z.preprocess(
    (val) => {
      if (val === undefined || val === null) return undefined
      const num = typeof val === 'string' ? Number.parseInt(val, 10) : val
      return Number.isNaN(num) ? undefined : num
    },
    z.number().optional()
  ),
  pageid: z.preprocess(
    (val) => {
      if (val === undefined || val === null) return undefined
      const num = typeof val === 'string' ? Number.parseInt(val, 10) : val
      return Number.isNaN(num) ? undefined : num
    },
    z.number().optional()
  ),
  isPreview: z.preprocess(
    (val) => {
      if (val === undefined || val === null) return undefined
      if (typeof val === 'boolean') return val
      if (typeof val === 'string') {
        const lower = val.toLowerCase()
        return lower === 'true' || lower === '1'
      }
      return false
    },
    z.boolean().optional()
  ),
  IsPreview: z.preprocess(
    (val) => {
      if (val === undefined || val === null) return undefined
      if (typeof val === 'boolean') return val
      if (typeof val === 'string') {
        const lower = val.toLowerCase()
        return lower === 'true' || lower === '1'
      }
      return false
    },
    z.boolean().optional()
  ),
  mode: z.string().optional(),
}).transform((data) => ({
  pageId: data.pageId ?? data.pageid,
  isPreview: data.isPreview ?? data.IsPreview ?? false,
  mode: data.mode,
}))

export const Route = createFileRoute('/iframe/landing-page-cms/page-builder/')({
  component: PageBuilder,
  validateSearch: searchSchema,
})
