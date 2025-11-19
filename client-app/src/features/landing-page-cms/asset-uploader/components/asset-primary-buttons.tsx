import { Download, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useAssetUploader } from './asset-uploader-provider'

export function AssetPrimaryButtons() {
  const { t } = useTranslation('asset-uploader')
  const { setOpen } = useAssetUploader()

  const handleExport = () => {
    toast.success(t('toasts.exporting'))
  }

  return (
    <div className='flex gap-2'>
      <Button variant='outline' onClick={handleExport}>
        <Download className='mr-2 h-4 w-4' />
        {t('buttons.export')}
      </Button>
      <Button onClick={() => setOpen('upload')}>
        <Plus className='mr-2 h-4 w-4' />
        {t('buttons.addAsset')}
      </Button>
    </div>
  )
}
