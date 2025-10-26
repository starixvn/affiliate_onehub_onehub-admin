import { getRouteApi } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Main } from '@/components/layout/main'
import { CampaignsPrimaryButtons } from './components/campaign-primary-buttons'
import { CampaignsProvider, useCampaigns } from './components/campaign-provider'
import { CampaignStatusFilters } from './components/campaign-status-filters'
import { CampaignDialogs } from './components/dialog/campaign-dialog'
import { CampaignTable } from './components/table/campaign-table'

const route = getRouteApi('/iframe/campaign-management/')

function CampaignManagementContent() {
  const { t } = useTranslation('campaign-management')
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { campaigns, totalCount, pageIndex, pageSize, isLoading } = useCampaigns()

  const selectedStatus =
    search.status !== undefined ? String(search.status) : '0,1,2,3'

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
        <CampaignsPrimaryButtons />
      </div>
      <CampaignStatusFilters selectedStatus={selectedStatus} />
      <CampaignTable
        data={campaigns}
        totalCount={totalCount}
        pageIndex={pageIndex}
        pageSize={pageSize}
        search={search}
        navigate={navigate}
      />
    </Main>
  )
}

export function CampaignManagement() {
  const search = route.useSearch()

  const params = {
    search: search.search as string | undefined,
    status: (search.status as string | undefined) ?? '0,1,2,3',
    pageIndex: search.pageIndex ? Number(search.pageIndex) : 1,
    pageSize: search.pageSize ? Number(search.pageSize) : 10,
  }

  return (
    <CampaignsProvider params={params}>
      <CampaignManagementContent />
      <CampaignDialogs />
    </CampaignsProvider>
  )
}
