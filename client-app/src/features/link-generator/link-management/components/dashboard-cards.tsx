import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link2, MousePointerClick, UserPlus, DollarSign, TrendingUp, Gift } from 'lucide-react'
import { useLinks } from './link-provider'

export function DashboardCards() {
    const { t } = useTranslation('link-management')
    const { dashboard, isLoading } = useLinks()

    const cards = [
        {
            title: t('summary.totalLinks'),
            value: dashboard?.totalLinks ?? 0,
            icon: Link2,
        },
        {
            title: t('summary.uniqueClicks'),
            value: dashboard?.totalClicks ?? 0,
            icon: MousePointerClick,
        },
        {
            title: t('summary.totalRegistrations'),
            value: dashboard?.totalRegistrations ?? 0,
            icon: UserPlus,
        },
        {
            title: t('summary.totalBonusUsers'),
            value: dashboard?.bonus ?? 0,
            icon: Gift,
        },
        {
            title: t('summary.totalFtds'),
            value: dashboard?.totalFTDs ?? 0,
            icon: DollarSign,
        },
        {
            title: t('summary.avgFtdAmount'),
            value: (dashboard?.avgFTDs ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            icon: TrendingUp,
        },
    ]

    return (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-6'>
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

