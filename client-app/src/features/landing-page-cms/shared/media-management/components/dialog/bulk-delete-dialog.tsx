import { type UseMutationResult } from '@tanstack/react-query'
import { type Table } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import type { DeleteMediaResponse, MediaDetail } from '../../schema'

type MediaBulkDeleteDialogProps = {
  translationKey: string
  useDeleteMutation: () => UseMutationResult<
    DeleteMediaResponse,
    Error,
    string,
    unknown
  >
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<MediaDetail>
}

export function MediaBulkDeleteDialog({
  translationKey,
  useDeleteMutation,
  open,
  onOpenChange,
  table,
}: MediaBulkDeleteDialogProps) {
  const { t } = useTranslation(translationKey)
  const deleteMutation = useDeleteMutation()
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = () => {
    const associatedMedia = selectedRows.filter((row) => {
      return row.original.isMediaIdInUse === true
    })
    if (associatedMedia.length === selectedRows.length) {
      toast.error(t('toasts.deleteInUseError'))
      return
    }

    const unassociatedMediaIds = selectedRows
      .filter((row) => {
        return row.original.isMediaIdInUse === false
      })
      .map((row) => row.original.mediaId.toString())
      .join(',')

    deleteMutation.mutate(unassociatedMediaIds, {
      onSuccess: (response: DeleteMediaResponse) => {
        if (response.errorCode === 0) {
          table.resetRowSelection()
          onOpenChange(false)
        }
      },
    })
  }

  const entity =
    translationKey === 'asset-uploader'
      ? selectedRows.length > 1
        ? t('dialogs.images')
        : t('dialogs.image')
      : selectedRows.length > 1
        ? t('dialogs.forms')
        : t('dialogs.form')

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={deleteMutation.isPending}
      title={t('dialogs.confirmDeleteBulk', {
        count: selectedRows.length,
        entity,
      })}
      desc={t('dialogs.deleteDescription')}
      confirmText={
        deleteMutation.isPending
          ? t('dialogs.deleting')
          : t('dialogs.deleteAll')
      }
      destructive
      isLoading={deleteMutation.isPending}
    />
  )
}
