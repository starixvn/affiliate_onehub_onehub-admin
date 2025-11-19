import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useAssetUploader } from './asset-uploader-provider'

export function AssetPrimaryButtons() {
  const { t } = useTranslation('asset-uploader')
  const { setOpen } = useAssetUploader()

  return (
    <div className='flex gap-2'>
      <Button onClick={() => setOpen('upload')}>
        <Plus className='mr-2 h-4 w-4' />
        {t('buttons.addAsset')}
      </Button>
    </div>
  )
}
