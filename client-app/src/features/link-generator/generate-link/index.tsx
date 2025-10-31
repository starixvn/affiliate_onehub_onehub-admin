import { useTranslation } from 'react-i18next'
import { Main } from '@/components/layout/main'
import { GenerateLinkProvider, useGenerateLink } from './components/generate-link-provider'
import { GenerateLinkForm } from './components/generate-link-form'
import { GenerateLinkActions } from './components/generate-link-actions'
import { GenerateLinkDialogs } from './components/dialogs/generate-link-dialogs'

function GenerateLinkContent() {
  const { t } = useTranslation('link-generator')
  const { isLoading } = useGenerateLink()

  if (isLoading) {
    return (
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>{t('page.title')}</h2>
            <p className='text-muted-foreground'>
              {t('page.description')}
            </p>
          </div>
        </div>
        <div className='flex items-center justify-center py-8'>
          <p className='text-muted-foreground'>{t('page.loading')}</p>
        </div>
      </Main>
    )
  }

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='flex flex-col sm:flex-row sm:flex-wrap sm:items-end sm:justify-between gap-2'>
        <div>
          <h2 className='text-xl sm:text-2xl font-bold tracking-tight'>{t('page.title')}</h2>
          <p className='text-muted-foreground text-sm sm:text-base'>
            {t('page.description')}
          </p>
        </div>
      </div>
      <div className='rounded-lg border bg-card p-4 sm:p-6'>
        <GenerateLinkForm />
      </div>
      <GenerateLinkActions />
    </Main>
  )
}

export function GenerateLink() {
  return (
    <GenerateLinkProvider>
      <GenerateLinkContent />
      <GenerateLinkDialogs />
    </GenerateLinkProvider>
  )
}
