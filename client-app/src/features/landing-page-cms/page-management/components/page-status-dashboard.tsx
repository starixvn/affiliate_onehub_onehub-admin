import { BarChart3, Play, FileText, Ban } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FilterCard } from '@/components/ui/filter-card'
import { useLandingPages } from './page-provider'

export function PageStatusDashboard() {
  const { t } = useTranslation('page-management')
  const { dashboard } = useLandingPages()

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      <FilterCard
        title={t('statusFilters.total')}
        count={dashboard?.total ?? 0}
        icon={BarChart3}
        variant='rainbow'
        disableHover
      />
      <FilterCard
        title={t('statusFilters.active')}
        count={dashboard?.active ?? 0}
        icon={Play}
        variant='success'
        disableHover
      />
      <FilterCard
        title={t('statusFilters.draft')}
        count={dashboard?.draft ?? 0}
        icon={FileText}
        variant='warning'
        disableHover
      />
      <FilterCard
        title={t('statusFilters.inactive')}
        count={dashboard?.inactive ?? 0}
        icon={Ban}
        variant='secondary'
        disableHover
      />
    </div>
  )
}
