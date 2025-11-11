import { getRouteApi } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Main } from '@/components/layout/main'
import { ComponentCategoryFilters } from './components/component-category-filters'
import { ComponentPrimaryButtons } from './components/component-primary-buttons'
import {
  ComponentsProvider,
  useComponents,
} from './components/component-provider'
import { ComponentDialogs } from './components/dialog/component-dialogs'
import { ComponentTable } from './components/table/component-table'

const route = getRouteApi('/iframe/link-generator/component-management/')

function ComponentManagementContent() {
  const { t } = useTranslation('component-management')
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { components, totalCount, pageIndex, pageSize, isLoading } =
    useComponents()

  const selectedCategory =
    search.category !== undefined ? String(search.category) : '1'

  if (isLoading) {
    return (
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {t('page.title')}
            </h2>
            <p className='text-muted-foreground'>{t('page.description')}</p>
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
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            {t('page.title')}
          </h2>
          <p className='text-muted-foreground'>{t('page.description')}</p>
        </div>
        <ComponentPrimaryButtons />
      </div>
      <ComponentCategoryFilters selectedCategory={selectedCategory} />
      <ComponentTable
        data={components}
        totalCount={totalCount}
        pageIndex={pageIndex}
        pageSize={pageSize}
        search={search}
        navigate={navigate}
      />
    </Main>
  )
}

export function ComponentManagement() {
  const search = route.useSearch()

  const params = {
    search: search.search as string | undefined,
    category: (search.category as string | undefined) ?? '1',
    status: (search.status as string | undefined) ?? '1',
    deviceIds: search.deviceIds as string | undefined,
    pageIndex: search.pageIndex ? Number(search.pageIndex) : 1,
    pageSize: search.pageSize ? Number(search.pageSize) : 10,
  }

  return (
    <ComponentsProvider params={params}>
      <ComponentManagementContent />
      <ComponentDialogs />
    </ComponentsProvider>
  )
}
