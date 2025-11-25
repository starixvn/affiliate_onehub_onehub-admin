import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Download, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { savePageManagementFilters } from '../utils/filter-storage'
import { useLandingPages } from './page-provider'

const route = getRouteApi('/iframe/landing-page-cms/page-management/')

export function PagesPrimaryButtons() {
  const { t } = useTranslation('page-management')
  const { exportLandingPages } = useLandingPages()
  const [isExporting, setIsExporting] = useState(false)
  const search = route.useSearch()

  const handleExport = async () => {
    try {
      setIsExporting(true)
      await exportLandingPages()
    } finally {
      setIsExporting(false)
    }
  }

  const handleCreate = () => {
    savePageManagementFilters(search)
    if (window.parent) {
      window.parent.location.href = '/landing-page-cms/page-builder?mode=create'
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
      <Button className='space-x-1' onClick={handleCreate}>
        <span>{t('buttons.create')}</span> <Plus size={18} />
      </Button>
    </div>
  )
}
