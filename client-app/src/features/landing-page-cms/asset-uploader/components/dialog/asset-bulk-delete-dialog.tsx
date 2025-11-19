import { type Table } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteAssets } from '../../api/commands'
import type { AssetDetail } from '../../data/schema'

type AssetBulkDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<AssetDetail>
}

export function AssetBulkDeleteDialog({
  open,
  onOpenChange,
  table,
}: AssetBulkDeleteDialogProps) {
  const { t } = useTranslation('asset-uploader')
  const deleteMutation = useDeleteAssets()
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = () => {
    const associatedAssets = selectedRows.filter((row) => {
      return row.original.isMediaIdInUse === true
    })
    if (associatedAssets.length === selectedRows.length) {
      toast.error(t('toasts.deleteInUseError'))
      return
    }

    const unassociatedAssetsIds = selectedRows
      .filter((row) => {
        return row.original.isMediaIdInUse === false
      })
      .map((row) => row.original.mediaId.toString())
      .join(',')

    deleteMutation.mutate(unassociatedAssetsIds, {
      onSuccess: (response: any) => {
        if (response.errorCode === 0) {
          table.resetRowSelection()
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
      title={t('dialogs.confirmDeleteBulk', {
        count: selectedRows.length,
        entity: selectedRows.length > 1 ? 'images' : 'image'
      })}
      desc={t('dialogs.deleteDescription')}
      confirmText={deleteMutation.isPending ? t('dialogs.deleting') : t('dialogs.deleteAll')}
      destructive
      isLoading={deleteMutation.isPending}
    />
  )
}
