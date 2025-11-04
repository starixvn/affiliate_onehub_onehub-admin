import { createFileRoute } from '@tanstack/react-router'
import { IframeContent } from '@/components/iframe-content'

export const Route = createFileRoute(
  '/_authenticated/landing-page-cms/asset-uploader/'
)({
  component: () => (
    <IframeContent iframePath='/iframe/landing-page-cms/asset-uploader' />
    // <IframeContent iframePath='/portal/assetuploader' />
  ),
})
