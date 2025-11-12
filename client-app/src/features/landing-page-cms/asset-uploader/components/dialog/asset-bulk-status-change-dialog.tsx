import { type Table } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useUpdateAssetsStatus } from '../../api/commands'
import type { AssetDetail } from '../../data/schema'

type AssetBulkStatusChangeDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<AssetDetail>
  newStatusId: number
}

export function AssetBulkStatusChangeDialog({
  open,
  onOpenChange,
  table,
  newStatusId,
}: AssetBulkStatusChangeDialogProps) {
  const { t } = useTranslation('asset-uploader')
  const updateStatusMutation = useUpdateAssetsStatus()
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleStatusChange = () => {
    const affectedAssets = selectedRows.filter(
      (row) => row.original.statusId !== newStatusId
    )

    const assetIds = affectedAssets
      .map((row) => row.original.mediaId.toString())
      .join(',')

    updateStatusMutation.mutate(
      { ids: assetIds, statusId: newStatusId },
      {
        onSuccess: (response) => {
          if (response.errorCode === 0) {
            table.resetRowSelection()
            onOpenChange(false)
          }
        },
      }
    )
  }

  const statusText =
    newStatusId === 1
      ? t('bulkActions.changeToActive')
      : t('bulkActions.changeToInactive')
  const affectedCount = selectedRows.filter(
    (row) => row.original.statusId !== newStatusId
  ).length

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleStatusChange}
      disabled={updateStatusMutation.isPending || affectedCount === 0}
      title={t('dialogs.confirmStatusChangeBulk')}
      desc={`${statusText} ${affectedCount} ${affectedCount > 1 ? 'assets' : 'asset'}.`}
      confirmText={
        updateStatusMutation.isPending
          ? t('dialogs.changing')
          : t('dialogs.changeAll')
      }
      isLoading={updateStatusMutation.isPending}
    />
  )
}
