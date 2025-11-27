import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLinks } from './link-provider'

export function LinksPrimaryButtons() {
    const { t } = useTranslation('link-management')
    const { exportLinks } = useLinks()

    return (
        <div className='flex items-center gap-2'>
            <Button
                variant='outline'
                size='sm'
                onClick={exportLinks}
                className='h-8 gap-1'
            >
                <Download className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                    {t('buttons.export')}
                </span>
            </Button>
        </div>
    )
}

