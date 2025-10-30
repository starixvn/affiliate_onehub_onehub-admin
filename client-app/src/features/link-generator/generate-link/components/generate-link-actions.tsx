import { Link, SquareArrowOutUpRight, RefreshCw } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useGenerateLink } from './generate-link-provider'

export function GenerateLinkActions() {
  const { t } = useTranslation('link-generator')
  const { form } = useGenerateLink()
  const navigate = useNavigate()

  const handleGenerateLink = form.handleSubmit((_data) => {
  })

  const handleGoToLinkManagement = () => {
    navigate({ to: '/iframe/link-generator/link-management' })
  }

  const handleReset = () => {
    form.reset()
  }

  return (
    <div className='flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2'>
      <Button onClick={handleGenerateLink} className='w-full sm:w-auto'>
        <Link className='h-4 w-4 sm:mr-2' />
        <span className='hidden sm:inline'>{t('buttons.generateLink')}</span>
      </Button>
      <Button onClick={handleGoToLinkManagement} className='w-full sm:w-auto'>
        <SquareArrowOutUpRight className='h-4 w-4 sm:mr-2' />
        <span className='hidden sm:inline'>{t('buttons.goToLinkManagement')}</span>
      </Button>
      <Button variant='outline' onClick={handleReset} className='w-full sm:w-auto'>
        <RefreshCw className='h-4 w-4 sm:mr-2' />
        <span className='hidden sm:inline'>{t('buttons.reset')}</span>
      </Button>
    </div>
  )
}

