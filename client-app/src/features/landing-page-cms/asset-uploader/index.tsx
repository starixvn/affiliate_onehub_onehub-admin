import { AssetUploaderContent } from './components/asset-uploader-content'
import { AssetUploaderProvider } from './components/asset-uploader-provider'
import { AssetDialogManager } from './components/dialog/asset-dialog-manager'

export function AssetUploader() {
  return (
    <AssetUploaderProvider>
      <AssetUploaderContent />
      <AssetDialogManager />
    </AssetUploaderProvider>
  )
}
