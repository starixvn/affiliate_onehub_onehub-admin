import { useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { getRouteApi } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Main } from '@/components/layout/main'
import { usePageFilters } from './api/queries'
import { PageDialogs } from './components/dialog/page-dialog'
import { PagesPrimaryButtons } from './components/page-primary-buttons'
import {
  LandingPagesProvider,
  useLandingPages,
} from './components/page-provider'
import { PageStatusDashboard } from './components/page-status-dashboard'
import { PageTable } from './components/table/page-table'
import { loadPageManagementFilters } from './utils/filter-storage'

const route = getRouteApi('/iframe/landing-page-cms/page-management/')
const DEFAULT_STATUS = '0,1'

function PageManagementContent() {
  const { t } = useTranslation('page-management')
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const {
    landingPages,
    totalCount,
    pageIndex,
    pageSize,
    isLoading,
    landingPageUrl,
  } = useLandingPages()

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
        <PagesPrimaryButtons />
      </div>
      <PageStatusDashboard />
      <PageTable
        data={landingPages}
        totalCount={totalCount}
        pageIndex={pageIndex}
        pageSize={pageSize}
        search={search}
        navigate={navigate}
        landingPageUrl={landingPageUrl}
      />
    </Main>
  )
}

export function PageManagement() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const {
    defaultFromDate,
    defaultToDate,
    isLoading: isLoadingFilters,
  } = usePageFilters()
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (isLoadingFilters || !defaultFromDate || !defaultToDate) return
    if (hasInitialized.current) return

    const savedFilters = loadPageManagementFilters()

    if (savedFilters && Object.keys(savedFilters).length > 0) {
      hasInitialized.current = true
      navigate({
        search: savedFilters,
        replace: true,
      })
      return
    }

    const needsStatus = !search.status
    const needsDates = !search.fromDate || !search.toDate
    const hasPreset = !!search.preset

    if (needsStatus || (needsDates && !hasPreset)) {
      const updates: Record<string, string> = {}

      if (needsStatus) {
        updates.status = DEFAULT_STATUS
      }

      if (needsDates && !hasPreset) {
        if (!search.fromDate) {
          updates.fromDate = format(defaultFromDate, 'yyyy-MM-dd')
        }
        if (!search.toDate) {
          updates.toDate = format(defaultToDate, 'yyyy-MM-dd')
        }
      }

      hasInitialized.current = true
      navigate({
        search: {
          ...search,
          ...updates,
        },
        replace: true,
      })
    } else {
      hasInitialized.current = true
    }
  }, [isLoadingFilters, defaultFromDate, defaultToDate])

  const hasRequiredParams =
    search.status && ((search.fromDate && search.toDate) || search.preset)

  if (isLoadingFilters || !hasRequiredParams) {
    return (
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Page Management
            </h2>
            <p className='text-muted-foreground'>Loading...</p>
          </div>
        </div>
      </Main>
    )
  }

  const params = {
    search: search.search as string | undefined,
    statusIds: search.status as string,
    countryCodes: search.countryCode as string | undefined,
    languageCodes: search.languageCode as string | undefined,
    fromDate: search.fromDate as string,
    toDate: search.toDate as string,
    pageIndex: search.pageIndex ? Number(search.pageIndex) : 1,
    pageSize: search.pageSize ? Number(search.pageSize) : 10,
  }

  return (
    <LandingPagesProvider params={params}>
      <PageManagementContent />
      <PageDialogs />
    </LandingPagesProvider>
  )
}
