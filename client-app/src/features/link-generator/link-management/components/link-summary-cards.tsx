import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link2, MousePointerClick, UserPlus, DollarSign, TrendingUp } from 'lucide-react'
import { useGetLinkSummary } from '../api/queries'
import type { GetLinkSummaryRequest } from '../types'

interface LinkSummaryCardsProps {
    params?: GetLinkSummaryRequest
}

export function LinkSummaryCards({ params }: LinkSummaryCardsProps) {
    const { t } = useTranslation('link-management')
    const { data, isLoading } = useGetLinkSummary(params)

    const cards = [
        {
            title: t('summary.totalLinks'),
            value: data?.totalLinks ?? 0,
            icon: Link2,
        },
        {
            title: t('summary.uniqueClicks'),
            value: data?.uniqueClicks ?? 0,
            icon: MousePointerClick,
        },
        {
            title: t('summary.totalRegistrations'),
            value: data?.totalRegistrations ?? 0,
            icon: UserPlus,
        },
        {
            title: t('summary.totalFtds'),
            value: data?.totalFtds ?? 0,
            icon: DollarSign,
        },
        {
            title: t('summary.avgFtdAmount'),
            value: (data?.avgFtdAmount ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            icon: TrendingUp,
        },
    ]

    return (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
            {cards.map((card, index) => {
                const Icon = card.icon
                return (
                    <Card key={index} className='py-2'>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-0'>
                            <CardTitle className='text-sm font-medium'>
                                {card.title}
                            </CardTitle>
                            <Icon className='h-4 w-4 text-muted-foreground' />
                        </CardHeader>
                        <CardContent className='pb-0'>
                            <div className='text-lg font-bold'>
                                {isLoading ? '...' : card.value}
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

