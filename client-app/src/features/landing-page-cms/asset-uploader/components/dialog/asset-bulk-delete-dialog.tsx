import { type Table } from '@tanstack/react-table'
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
  const deleteMutation = useDeleteAssets()
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = () => {
    const associatedAssets = selectedRows.filter((row) => {
      return row.original.isMediaIdInUse === true
    })
    if (associatedAssets.length === selectedRows.length) {
      toast.error(
        'All selected items are currently in use and cannot be deleted.'
      )
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
      title={`Are you sure you want to delete ${selectedRows.length} ${selectedRows.length > 1 ? 'images' : 'image'}?`}
      desc={`This action cannot be undone. The delete action will only be performed on assets that are not associated with any landing page.`}
      confirmText={deleteMutation.isPending ? 'Deleting...' : 'Delete All'}
      destructive
      isLoading={deleteMutation.isPending}
    />
  )
}
