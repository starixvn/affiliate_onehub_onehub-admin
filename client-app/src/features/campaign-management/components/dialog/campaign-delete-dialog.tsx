'use client'

import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteCampaign } from '../../api/commands'
import { type Campaign } from '../../data/schema'

type CampaignDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Campaign
}

export function CampaignDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: CampaignDeleteDialogProps) {
  const { t } = useTranslation('campaign-management')
  const deleteMutation = useDeleteCampaign()

  const handleDelete = () => {
    deleteMutation.mutate(currentRow.campaignId, {
      onSuccess: (response) => {
        if (response.errorCode === 0) {
          onOpenChange(false)
        }
      },
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={deleteMutation.isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          {t('dialog.delete.title')}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            {t('dialog.delete.message')}{' '}
            <span className='font-bold'>{currentRow.campaignName}</span>?
            <br />
            {t('dialog.delete.description')}
          </p>

          <Alert variant='destructive'>
            <AlertTitle>{t('dialog.delete.warning')}</AlertTitle>
            <AlertDescription>
              {t('dialog.delete.warningMessage')}
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={t('dialog.delete.confirm')}
      cancelBtnText={t('dialog.delete.cancel')}
      destructive
    />
  )
}
