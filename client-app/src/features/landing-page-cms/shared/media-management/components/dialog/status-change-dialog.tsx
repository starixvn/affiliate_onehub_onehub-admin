import { UseMutationResult } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '@/components/confirm-dialog'
import type { MediaDetail } from '../../schema'

type AssetStatusChangeDialogProps = {
  translationKey: string
  open: boolean
  onOpenChange: (open: boolean) => void
  media: MediaDetail | null
  useUpdateStatusMutation: () => UseMutationResult<any, Error, any, unknown>
  newStatusId: number
}

export function StatusChangeDialog({
  translationKey,
  open,
  onOpenChange,
  media,
  useUpdateStatusMutation,
  newStatusId,
}: AssetStatusChangeDialogProps) {
  const { t } = useTranslation(translationKey)
  const updateStatusMutation = useUpdateStatusMutation()

  const handleConfirm = () => {
    if (!media) return

    updateStatusMutation.mutate(
      { ids: media.mediaId.toString(), statusId: newStatusId },
      {
        onSuccess: (response) => {
          if (response.errorCode === 0) {
            onOpenChange(false)
          }
        },
      }
    )
  }

  const entity = t('dialogs.status')

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleConfirm}
      disabled={updateStatusMutation.isPending}
      title={t('dialogs.confirmStatusChangeBulkDynamic', {
        count: 1,
        entity,
      })}
      desc={t('dialogs.confirmStatusChangeDesc')}
      confirmText={
        updateStatusMutation.isPending
          ? t('dialogs.changing')
          : t('dialogs.change')
      }
      isLoading={updateStatusMutation.isPending}
    />
  )
}
