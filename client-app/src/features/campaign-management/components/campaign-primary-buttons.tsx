import { Download, Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useCampaigns } from './campaign-provider'

export function CampaignsPrimaryButtons() {
  const { t } = useTranslation('campaign-management')
  const { setOpen, exportCampaigns } = useCampaigns()
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    try {
      setIsExporting(true)
      await exportCampaigns()
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={handleExport}
        disabled={isExporting}
      >
        <span>{t('buttons.export')}</span>
        <Download size={18} />
      </Button>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>{t('buttons.create')}</span> <Plus size={18} />
      </Button>
    </div>
  )
}
