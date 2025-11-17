import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useUpdateAssetsStatus } from '../../api/commands'
import type { AssetDetail } from '../../data/schema'

type AssetStatusChangeDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  asset: AssetDetail | null
  newStatusId: number
}

export function AssetStatusChangeDialog({
  open,
  onOpenChange,
  asset,
  newStatusId,
}: AssetStatusChangeDialogProps) {
  const { t } = useTranslation('asset-uploader')
  const updateStatusMutation = useUpdateAssetsStatus()

  const handleConfirm = () => {
    if (!asset) return

    updateStatusMutation.mutate(
      { ids: asset.mediaId.toString(), statusId: newStatusId },
      {
        onSuccess: (response) => {
          if (response.errorCode === 0) {
            onOpenChange(false)
          }
        },
      }
    )
  }

  const statusLabel =
    newStatusId === 1 ? t('table.active') : t('table.inactive')

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleConfirm}
      disabled={updateStatusMutation.isPending}
      title={t('dialogs.confirmStatusChange', {
        assetName: asset?.mediaName,
        status: statusLabel,
      })}
      desc={''}
      confirmText={
        updateStatusMutation.isPending
          ? t('dialogs.changing')
          : t('dialogs.change')
      }
      isLoading={updateStatusMutation.isPending}
    />
  )
}
