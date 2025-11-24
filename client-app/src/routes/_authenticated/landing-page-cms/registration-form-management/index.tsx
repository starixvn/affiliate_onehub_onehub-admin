import { createFileRoute } from '@tanstack/react-router'
import { IframeContent } from '@/components/iframe-content'

export const Route = createFileRoute(
  '/_authenticated/landing-page-cms/registration-form-management/'
)({
  component: () => (
    <IframeContent iframePath='/iframe/landing-page-cms/registration-form-management' />
    // <IframeContent iframePath='/portal/formmanagement' />
  ),
})
