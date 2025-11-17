import { useTranslation } from 'react-i18next'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useLinks } from '../link-provider'

export function LinkDetailDialog() {
    const { t } = useTranslation('link-management')
    const { open, setOpen, currentRow } = useLinks()

    if (!currentRow) return null

    return (
        <Dialog open={open === 'detail'} onOpenChange={() => setOpen(null)}>
            <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>{t('dialogs.detail.title')}</DialogTitle>
                    <DialogDescription>
                        {t('dialogs.detail.description')}
                    </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label className='text-right font-semibold'>
                            {t('table.columns.linkName')}:
                        </Label>
                        <div className='col-span-3'>{currentRow.linkName}</div>
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label className='text-right font-semibold'>
                            {t('table.columns.shortLink')}:
                        </Label>
                        <div className='col-span-3 break-all'>{currentRow.shortLink}</div>
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label className='text-right font-semibold'>
                            {t('table.columns.domainName')}:
                        </Label>
                        <div className='col-span-3'>{currentRow.domainName}</div>
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label className='text-right font-semibold'>
                            {t('table.columns.campaignName')}:
                        </Label>
                        <div className='col-span-3'>{currentRow.campaignName}</div>
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label className='text-right font-semibold'>
                            {t('table.columns.countryName')}:
                        </Label>
                        <div className='col-span-3'>{currentRow.countryName}</div>
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label className='text-right font-semibold'>
                            {t('table.columns.channelName')}:
                        </Label>
                        <div className='col-span-3'>{currentRow.channelName}</div>
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label className='text-right font-semibold'>
                            {t('table.columns.idCode')}:
                        </Label>
                        <div className='col-span-3'>{currentRow.idCode}</div>
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label className='text-right font-semibold'>
                            {t('table.columns.createdDate')}:
                        </Label>
                        <div className='col-span-3'>{currentRow.createdDate}</div>
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label className='text-right font-semibold'>
                            {t('table.columns.click')}:
                        </Label>
                        <div className='col-span-3'>{currentRow.click}</div>
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label className='text-right font-semibold'>
                            {t('table.columns.registration')}:
                        </Label>
                        <div className='col-span-3'>{currentRow.registration}</div>
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label className='text-right font-semibold'>
                            {t('table.columns.ftd')}:
                        </Label>
                        <div className='col-span-3'>{currentRow.ftd}</div>
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label className='text-right font-semibold'>
                            {t('table.columns.avgFtdAmount')}:
                        </Label>
                        <div className='col-span-3'>
                            ${currentRow.avgFtdAmount.toFixed(2)}
                        </div>
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label className='text-right font-semibold'>
                            {t('table.columns.status')}:
                        </Label>
                        <div className='col-span-3'>{currentRow.statusName}</div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

