import { createFileRoute } from '@tanstack/react-router'
import { IframeContent } from '@/components/iframe-content'

export const Route = createFileRoute(
  '/_authenticated/landing-page-cms/page-builder/'
)({
  component: () => (
    // <IframeContent iframePath='/iframe/landing-page-cms/page-builder' />
    <IframeContent iframePath='/portal/pagebuilder' />
  ),
})
