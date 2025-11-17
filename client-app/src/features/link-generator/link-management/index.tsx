import { getRouteApi } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Main } from '@/components/layout/main'
import { LinksPrimaryButtons } from './components/link-primary-buttons'
import { LinksProvider, useLinks } from './components/link-provider'
import { LinkStatusFilters } from './components/link-status-filters'
import { LinkDialogs } from './components/dialog/link-dialog'
import { LinkTable } from './components/table/link-table'
import { LinkSummaryCards } from './components/link-summary-cards'

const route = getRouteApi('/iframe/link-generator/link-management/')

function LinkManagementContent() {
    const { t } = useTranslation('link-management')
    const search = route.useSearch()
    const navigate = route.useNavigate()
    const { links, totalCount, pageIndex, pageSize, isLoading } = useLinks()

    const selectedStatus =
        search.status !== undefined ? String(search.status) : '0,1'

    const summaryParams = {
        search: search.search as string | undefined,
        countryCodes: search.countryCodes as string | undefined,
        channelIds: search.channelIds as string | undefined,
        startDate: search.startDate as string | undefined,
        endDate: search.endDate as string | undefined,
    }

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
                <LinksPrimaryButtons />
            </div>
            <LinkSummaryCards params={summaryParams} />
            <LinkStatusFilters
                selectedStatus={selectedStatus}
                onStatusChange={(status) => {
                    navigate({
                        search: {
                            ...search,
                            status,
                            pageIndex: 1,
                        },
                    })
                }}
            />
            <LinkTable
                data={links}
                totalCount={totalCount}
                pageIndex={pageIndex}
                pageSize={pageSize}
                search={search}
                navigate={navigate}
            />
        </Main>
    )
}

export function LinkManagement() {
    const search = route.useSearch()

    const params = {
        search: search.search as string | undefined,
        status: (search.status as string | undefined) ?? '0,1',
        countryCodes: search.countryCodes as string | undefined,
        channelIds: search.channelIds as string | undefined,
        startDate: search.startDate as string | undefined,
        endDate: search.endDate as string | undefined,
        pageIndex: search.pageIndex ? Number(search.pageIndex) : 1,
        pageSize: search.pageSize ? Number(search.pageSize) : 10,
    }

    return (
        <LinksProvider params={params}>
            <LinkManagementContent />
            <LinkDialogs />
        </LinksProvider>
    )
}

