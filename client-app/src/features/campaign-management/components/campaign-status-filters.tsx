import { getRouteApi } from '@tanstack/react-router'
import { BarChart3, Play, FileText, Pause, Ban } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FilterCard } from '@/components/ui/filter-card'
import { useGetCampaignSummary } from '../api/queries'

const route = getRouteApi('/iframe/campaign-management/')

type CampaignStatusFiltersProps = {
  selectedStatus: string | null
}

export function CampaignStatusFilters({
  selectedStatus,
}: CampaignStatusFiltersProps) {
  const { t } = useTranslation('campaign-management')
  const navigate = route.useNavigate()
  const search = route.useSearch()
  const { data } = useGetCampaignSummary()

  const handleStatusClick = (status: string | null) => {
    navigate({
      search: {
        ...search,
        status: status ?? undefined,
        pageIndex: 1,
      },
    })
  }

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
      <FilterCard
        title={t('statusFilters.total')}
        count={data?.total ?? 0}
        icon={BarChart3}
        variant='rainbow'
        selected={selectedStatus === '0,1,2,3'}
        onClick={() => handleStatusClick('0,1,2,3')}
      />
      <FilterCard
        title={t('statusFilters.active')}
        count={data?.active ?? 0}
        icon={Play}
        variant='success'
        selected={selectedStatus === '1'}
        onClick={() => handleStatusClick('1')}
      />
      <FilterCard
        title={t('statusFilters.draft')}
        count={data?.draft ?? 0}
        icon={FileText}
        variant='warning'
        selected={selectedStatus === '0'}
        onClick={() => handleStatusClick('0')}
      />
      <FilterCard
        title={t('statusFilters.paused')}
        count={data?.paused ?? 0}
        icon={Pause}
        variant='info'
        selected={selectedStatus === '2'}
        onClick={() => handleStatusClick('2')}
      />
      <FilterCard
        title={t('statusFilters.inactive')}
        count={data?.inactive ?? 0}
        icon={Ban}
        variant='secondary'
        selected={selectedStatus === '3'}
        onClick={() => handleStatusClick('3')}
      />
    </div>
  )
}
