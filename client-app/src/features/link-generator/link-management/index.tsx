import { getRouteApi } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Main } from '@/components/layout/main'
import { LinksPrimaryButtons } from './components/link-primary-buttons'
import { LinksProvider, useLinks } from './components/link-provider'
import { LinkDialogs } from './components/dialog/link-dialog'
import { LinkTable } from './components/table/link-table'
import { DashboardCards } from './components/dashboard-cards'
import { getDefaultStartDate, getDefaultEndDate } from './utils/date'

const route = getRouteApi('/iframe/link-generator/link-management/')

function LinkManagementContent() {
    const { t } = useTranslation('link-management')
    const search = route.useSearch()
    const navigate = route.useNavigate()
    const { links, totalCount, pageIndex, pageSize, isLoading, error } = useLinks()

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

    if (error) {
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
                    <p className='text-destructive'>{t('errors.loadingFailed')}</p>
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
            <DashboardCards />
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
        search: search.search ?? undefined,
        statusIds: search.statusIds ?? '1',
        countryCodes: search.countryCodes ?? undefined,
        channelIds: search.channelIds ?? undefined,
        startDate: search.startDate ?? getDefaultStartDate(),
        endDate: search.endDate ?? getDefaultEndDate(),
        pageIndex: search.pageIndex ?? 1,
        pageSize: search.pageSize ?? 10,
    }

    return (
        <LinksProvider params={params}>
            <LinkManagementContent />
            <LinkDialogs />
        </LinksProvider>
    )
}

