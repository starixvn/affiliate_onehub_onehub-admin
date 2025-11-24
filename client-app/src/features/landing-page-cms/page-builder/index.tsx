import { useTranslation } from 'react-i18next'
import { Main } from '@/components/layout/main'
import { PageBuilderForm } from './components/page-builder-form'

export function PageBuilder() {
  const { t } = useTranslation('page-builder')
  return (
    <Main>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>{t('page.title')}</h1>
      </div>

      <div className='rounded-lg border bg-card p-4 sm:p-6'>
        <PageBuilderForm />
      </div>
    </Main>
  )
}
