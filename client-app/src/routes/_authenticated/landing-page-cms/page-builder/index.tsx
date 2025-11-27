import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { IframeContent } from '@/components/iframe-content'

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
})

export const Route = createFileRoute(
  '/_authenticated/landing-page-cms/page-builder/'
)({
  component: PageBuilderWrapper,
  validateSearch: searchSchema,
})

function PageBuilderWrapper() {
  const search = Route.useSearch()
  const pageId = search.pageId ?? search.pageid
  const isPreview = search.isPreview ?? search.IsPreview ?? false
  const mode = (search as { mode?: string }).mode

  const buildIframePath = () => {
    const params = new URLSearchParams()
    if (pageId !== undefined) {
      params.set('pageId', String(pageId))
    }
    if (isPreview) {
      params.set('isPreview', 'true')
    }
    if (mode) {
      params.set('mode', mode)
    }
    const queryString = params.toString()
    return `/iframe/landing-page-cms/page-builder${queryString ? `?${queryString}` : ''}`
  }

  return <IframeContent iframePath={buildIframePath()} />
}
