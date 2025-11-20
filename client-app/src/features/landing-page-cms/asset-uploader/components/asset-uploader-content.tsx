import {
  SharedContent,
  SharedPrimaryButtons,
} from '@/features/landing-page-cms/shared'
import { TRANSLATION_KEY } from '../data/schema'
import { useAssetUploader } from './asset-uploader-provider'
import { AssetTable } from './table/asset-table'

export function AssetUploaderContent() {
  const { assets, setOpen, bannerRootUrl, totalCount, isLoading, isError } =
    useAssetUploader()

  return (
    <SharedContent
      translationKey={TRANSLATION_KEY}
      Table={AssetTable}
      PrimaryButtons={
        <SharedPrimaryButtons
          translationKey={TRANSLATION_KEY}
          onOpenUpload={() => setOpen('upload')}
        />
      }
      items={assets}
      bannerRootUrl={bannerRootUrl}
      totalCount={totalCount}
      isLoading={isLoading}
      isError={isError}
    />
  )
}
