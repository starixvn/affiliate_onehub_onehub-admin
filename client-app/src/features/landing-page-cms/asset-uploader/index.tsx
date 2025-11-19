import { getRouteApi } from '@tanstack/react-router'
import { AssetUploaderContent } from './components/asset-uploader-content'
import { AssetUploaderProvider } from './components/asset-uploader-provider'
import { AssetDialogManager } from './components/dialog/asset-dialog-manager'
import { normalizeSearchParams } from './data/constants'

const route = getRouteApi('/iframe/landing-page-cms/asset-uploader/')

export function AssetUploader() {
  const search = route.useSearch()

  const params = normalizeSearchParams(search)

  return (
    <AssetUploaderProvider params={params}>
      <AssetUploaderContent />
      <AssetDialogManager />
    </AssetUploaderProvider>
  )
}
