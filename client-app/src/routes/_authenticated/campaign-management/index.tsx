import { createFileRoute } from '@tanstack/react-router'
import { IframeContent } from '@/components/iframe-content'

export const Route = createFileRoute('/_authenticated/campaign-management/')({
  component: () => <IframeContent iframePath='/iframe/campaign-management' />,
})
