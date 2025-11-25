'use client'

import { Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useUpdateCampaign } from '../../api/commands'
import { status } from '../../data/data'
import { type Campaign } from '../../data/schema'

type CampaignStatusChangeDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Campaign
  newStatusId: number
}

export function CampaignStatusChangeDialog({
  open,
  onOpenChange,
  currentRow,
  newStatusId,
}: CampaignStatusChangeDialogProps) {
  const { t } = useTranslation('campaign-management')
  const updateMutation = useUpdateCampaign()

  const currentStatus = status.find(
    (s) => s.value === String(currentRow.statusId)
  )
  const newStatus = status.find((s) => s.value === String(newStatusId))

  const handleConfirm = () => {
    updateMutation.mutate(
      {
        id: currentRow.campaignId,
        data: {
          campaignId: currentRow.campaignId,
          campaignName: currentRow.campaignName,
          description: currentRow.description,
          statusId: newStatusId,
        },
      },
      {
        onSuccess: (response) => {
          if (response.errorCode === 0) {
            onOpenChange(false)
          }
        },
      }
    )
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleConfirm}
      disabled={updateMutation.isPending}
      title={
        <span>
          <Info className='me-1 inline-block' size={18} />
          {t('dialog.statusChange.title')}
        </span>
      }
      desc={
        <div className='space-y-2'>
          <p>
            {t('dialog.statusChange.message')}{' '}
            <span className='font-bold'>{currentRow.campaignName}</span>?
          </p>
          <p className='text-sm'>
            {t('dialog.statusChange.from')}{' '}
            <span className='font-semibold'>{currentStatus?.label}</span> →{' '}
            <span className='font-semibold'>{newStatus?.label}</span>
          </p>
        </div>
      }
      confirmText={t('dialog.statusChange.confirm')}
      cancelBtnText={t('dialog.statusChange.cancel')}
    />
  )
}
