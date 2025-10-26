import { createFileRoute } from '@tanstack/react-router'
import { IframeContent } from '@/components/iframe-content'

export const Route = createFileRoute(
  '/_authenticated/link-generator/link-management/'
)({
  component: () => (
    <IframeContent iframePath='/iframe/link-generator/link-management' />
  ),
})
