import { createFileRoute } from '@tanstack/react-router'
import { IframeContent } from '@/components/iframe-content'

export const Route = createFileRoute(
  '/_authenticated/link-generator/generate-link/'
)({
  component: () => (
    <IframeContent iframePath='/iframe/link-generator/generate-link' />
  ),
})
