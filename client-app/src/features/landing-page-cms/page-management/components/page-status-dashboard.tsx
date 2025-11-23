import { getRouteApi } from '@tanstack/react-router'
import { BarChart3, Play, FileText, Ban } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FilterCard } from '@/components/ui/filter-card'
import { useGetLandingPageSummary } from '../api/queries'

const route = getRouteApi('/iframe/landing-page-cms/page-management/')

export function PageStatusDashboard() {
  const { t } = useTranslation('page-management')
  const search = route.useSearch()

  const summaryParams = {
    search: search.search as string | undefined,
    statusIds: search.status as string | undefined,
    countryCodes: search.countryCode as string | undefined,
    languageCodes: search.languageCode as string | undefined,
    fromDate: search.fromDate as string | undefined,
    toDate: search.toDate as string | undefined,
  }

  const { data } = useGetLandingPageSummary(summaryParams)

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      <FilterCard
        title={t('statusFilters.total')}
        count={data?.total ?? 0}
        icon={BarChart3}
        variant='rainbow'
        disableHover
      />
      <FilterCard
        title={t('statusFilters.active')}
        count={data?.active ?? 0}
        icon={Play}
        variant='success'
        disableHover
      />
      <FilterCard
        title={t('statusFilters.draft')}
        count={data?.draft ?? 0}
        icon={FileText}
        variant='warning'
        disableHover
      />
      <FilterCard
        title={t('statusFilters.inactive')}
        count={data?.inactive ?? 0}
        icon={Ban}
        variant='secondary'
        disableHover
      />
    </div>
  )
}
