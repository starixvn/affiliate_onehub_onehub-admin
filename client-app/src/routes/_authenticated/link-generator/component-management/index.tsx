import { createFileRoute } from '@tanstack/react-router'
import { IframeContent } from '@/components/iframe-content'

export const Route = createFileRoute(
  '/_authenticated/link-generator/component-management/'
)({
  component: () => (
    <IframeContent iframePath='/iframe/link-generator/component-management' />
  ),
})
