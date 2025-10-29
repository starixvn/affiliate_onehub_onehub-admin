import { getRouteApi } from '@tanstack/react-router'
import { AssetUploaderContent } from './components/asset-uploader-content'
import { AssetUploaderProvider } from './components/asset-uploader-provider'
import { AssetDialogs } from './components/dialog/asset-dialogs'
import { normalizeSearchParams } from './data/constants'

const route = getRouteApi('/iframe/landing-page-cms/asset-uploader/')

export function AssetUploader() {
  const search = route.useSearch()

  // Normalize search params với defaults
  const params = normalizeSearchParams(search)

  return (
    <AssetUploaderProvider params={params}>
      <AssetUploaderContent />
      <AssetDialogs />
    </AssetUploaderProvider>
  )
}
