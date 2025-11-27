import { useTranslation } from 'react-i18next'
import { Main } from '@/components/layout/main'
import { Route } from '@/routes/iframe/landing-page-cms/page-builder'
import { PageBuilderProvider, usePageBuilder } from './components/page-builder-provider'
import { PageBuilderForm } from './components/page-builder-form'

function PageBuilderContent() {
  const { t } = useTranslation('page-builder')
  const { isLoading } = usePageBuilder()

  if (isLoading) {
    return (
      <Main className='flex flex-1 flex-col gap-4 sm:gap-4'>
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
    <Main className='flex flex-1 flex-col gap-4 sm:gap-4'>
      <div className='flex flex-col sm:flex-row sm:flex-wrap sm:items-end sm:justify-between gap-2'>
        <div>
          <h2 className='text-xl sm:text-2xl font-bold tracking-tight'>{t('page.title')}</h2>
          <p className='text-muted-foreground text-sm sm:text-base'>
            {t('page.description')}
          </p>
        </div>
      </div>
      <div className='rounded-lg bg-card'>
        <PageBuilderForm />
      </div>
    </Main>
  )
}

export function PageBuilder() {
  const search = Route.useSearch()
  const pageId = search.pageId
  const isPreview = search.isPreview ?? false
  const mode = (search as { mode?: string }).mode
  
  return (
    <PageBuilderProvider pageId={pageId} isPreview={isPreview} mode={mode}>
      <PageBuilderContent />
    </PageBuilderProvider>
  )
}
