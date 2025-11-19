import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useLinks } from '../link-provider'

export function LinkDetailDialog() {
    const { t } = useTranslation('link-management')
    const { open, setOpen, currentRow } = useLinks()
    const [copied, setCopied] = useState(false)

    if (!currentRow) return null

    const handleCopyShortLink = async () => {
        try {
            await navigator.clipboard.writeText(currentRow.shortLink)
            setCopied(true)
            toast.success('Short link copied to clipboard')
            setTimeout(() => setCopied(false), 2000)
        } catch {
            toast.error('Failed to copy link')
        }
    }

    return (
        <Dialog open={open === 'detail'} onOpenChange={() => setOpen(null)}>
            <DialogContent className='max-w-3xl max-h-[80vh] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>{currentRow.linkName}</DialogTitle>
                    <DialogDescription>
                        {t('dialogs.detail.description')}
                    </DialogDescription>
                </DialogHeader>
                <div className='grid grid-cols-2 gap-6 py-4'>
                    <div className='space-y-2'>
                        <Label className='text-sm text-muted-foreground'>
                            {t('table.columns.idCode')}
                        </Label>
                        <div className='text-sm'>{currentRow.idCode || '-'}</div>
                    </div>

                    <div className='space-y-2'>
                        <Label className='text-sm text-muted-foreground'>
                            {t('dialogs.detail.event')}
                        </Label>
                        <div className='text-sm'>{currentRow.event || '-'}</div>
                    </div>

                    <div className='space-y-2'>
                        <Label className='text-sm text-muted-foreground'>
                            {t('dialogs.detail.landingPage')}
                        </Label>
                        <div className='text-sm'>{currentRow.landingPage || '-'}</div>
                    </div>

                    <div className='space-y-2'>
                        <Label className='text-sm text-muted-foreground'>
                            {t('dialogs.detail.group')}
                        </Label>
                        <div className='text-sm'>{currentRow.group || '-'}</div>
                    </div>

                    <div className='space-y-2'>
                        <Label className='text-sm text-muted-foreground'>
                            {t('table.columns.campaignName')}
                        </Label>
                        <div className='text-sm'>{currentRow.campaignName}</div>
                    </div>

                    <div className='space-y-2'>
                        <Label className='text-sm text-muted-foreground'>
                            {t('table.columns.channelName')}
                        </Label>
                        <div className='text-sm'>{currentRow.channelName}</div>
                    </div>

                    <div className='space-y-2'>
                        <Label className='text-sm text-muted-foreground'>
                            {t('table.columns.countryName')}
                        </Label>
                        <div className='text-sm'>{currentRow.countryName}</div>
                    </div>

                    <div className='space-y-2'>
                        <Label className='text-sm text-muted-foreground'>
                            {t('dialogs.detail.agency')}
                        </Label>
                        <div className='text-sm'>{currentRow.agency || '-'}</div>
                    </div>

                    <div className='space-y-2'>
                        <Label className='text-sm text-muted-foreground'>
                            {t('dialogs.detail.language')}
                        </Label>
                        <div className='text-sm'>{currentRow.language || '-'}</div>
                    </div>

                    <div className='space-y-2'>
                        <Label className='text-sm text-muted-foreground'>
                            {t('dialogs.detail.type')}
                        </Label>
                        <div className='text-sm'>{currentRow.type || '-'}</div>
                    </div>

                    <div className='col-span-2 space-y-2'>
                        <Label className='text-sm text-muted-foreground'>
                            {t('dialogs.detail.note')}
                        </Label>
                        <div className='text-sm'>{currentRow.note || '-'}</div>
                    </div>

                    <div className='col-span-2 space-y-2'>
                        <Label className='text-sm text-muted-foreground'>
                            {t('dialogs.detail.fullUrl')}
                        </Label>
                        <div className='rounded-md bg-muted px-3 py-2 text-sm break-all select-none'>
                            {currentRow.fullLink || '-'}
                        </div>
                    </div>

                    <div className='col-span-2 space-y-2'>
                        <Label className='text-sm text-muted-foreground'>
                            {t('dialogs.detail.shortUrl')}
                        </Label>
                        <div className='flex items-center gap-2'>
                            <div className='flex-1 rounded-md bg-muted px-3 py-2 text-sm break-all'>
                                {currentRow.shortLink}
                            </div>
                            <Button
                                variant='outline'
                                size='icon'
                                onClick={handleCopyShortLink}
                                className='shrink-0'
                            >
                                {copied ? (
                                    <Check className='h-4 w-4 text-green-500' />
                                ) : (
                                    <Copy className='h-4 w-4' />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

