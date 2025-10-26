import { createFileRoute } from '@tanstack/react-router'
import { AssetUploader } from '@/features/landing-page-cms/asset-uploader'

export const Route = createFileRoute('/iframe/landing-page-cms/asset-uploader/')({
  component: AssetUploader,
})
