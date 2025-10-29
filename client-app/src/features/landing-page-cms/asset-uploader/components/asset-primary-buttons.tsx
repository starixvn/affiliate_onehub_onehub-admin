import { Download, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useAssetUploader } from './asset-uploader-provider'

export function AssetPrimaryButtons() {
  const { setOpen } = useAssetUploader()

  const handleExport = () => {
    toast.success('Exporting assets to Excel...')
  }

  return (
    <div className='flex gap-2'>
      <Button variant='outline' onClick={handleExport}>
        <Download className='mr-2 h-4 w-4' />
        Export
      </Button>
      <Button onClick={() => setOpen('upload')}>
        <Plus className='mr-2 h-4 w-4' />
        Add Asset
      </Button>
    </div>
  )
}
