import { createFileRoute } from '@tanstack/react-router'
import { IframeContent } from '@/components/iframe-content'

export const Route = createFileRoute(
  '/_authenticated/landing-page-cms/page-management/'
)({
  component: () => (
    // <IframeContent iframePath='/iframe/landing-page-cms/page-management' />
    <IframeContent iframePath='/portal/landingpage' />
  ),
})
