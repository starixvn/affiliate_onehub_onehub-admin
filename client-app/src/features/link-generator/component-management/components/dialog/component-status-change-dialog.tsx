'use client'

import { Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useUpdateBatchComponentStatus } from '../../api/commands'
import { status } from '../../data/data'
import { type Component } from '../../data/schema'

type ComponentStatusChangeDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Component
  newStatusId: number
}

export function ComponentStatusChangeDialog({
  open,
  onOpenChange,
  currentRow,
  newStatusId,
}: ComponentStatusChangeDialogProps) {
  const { t } = useTranslation('component-management')
  const updateBatchStatusMutation = useUpdateBatchComponentStatus()

  const currentStatus = status.find(
    (s) => s.value === String(currentRow.statusId)
  )
  const newStatus = status.find((s) => s.value === String(newStatusId))

  const handleConfirm = () => {
    updateBatchStatusMutation.mutate(
      {
        componentIds: String(currentRow.componentId),
        statusId: newStatusId,
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
      disabled={updateBatchStatusMutation.isPending}
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
            <span className='font-bold'>{currentRow.componentName}</span>?
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
