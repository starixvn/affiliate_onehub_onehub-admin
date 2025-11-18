import { UseMutationResult } from '@tanstack/react-query'
import { type Table } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { status } from '../../data/data'
import type { MediaDetail, UpdateMediaStatusResponse } from '../../schema'

type MediaBulkStatusChangeDialogProps = {
  translationKey: string
  useUpdateStatusMutation: () => UseMutationResult<
    UpdateMediaStatusResponse,
    Error,
    { ids: string; statusId: number },
    unknown
  >
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<MediaDetail>
  newStatusId: number
}

export function MediaBulkStatusChangeDialog({
  translationKey,
  useUpdateStatusMutation,
  open,
  onOpenChange,
  table,
  newStatusId,
}: MediaBulkStatusChangeDialogProps) {
  const { t } = useTranslation(translationKey)
  const updateStatusMutation = useUpdateStatusMutation()
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleStatusChange = () => {
    const affectedMedia = selectedRows.filter(
      (row) => row.original.statusId !== newStatusId
    )

    if (affectedMedia.length === 0) {
      return
    }

    const mediaIds = affectedMedia
      .map((row) => row.original.mediaId.toString())
      .join(',')

    updateStatusMutation.mutate(
      { ids: mediaIds, statusId: newStatusId },
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

  const affectedCount = selectedRows.filter(
    (row) => row.original.statusId !== newStatusId
  ).length

  const entity = affectedCount > 1 ? t('dialogs.statuses') : t('dialogs.status')
  const targetStatus =
    status.find((s) => s.value === String(newStatusId))?.label ||
    t('dialogs.unknownStatus')

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleStatusChange}
      disabled={updateStatusMutation.isPending || affectedCount === 0}
      title={t('dialogs.confirmStatusChangeBulkWithTarget', {
        count: affectedCount,
        entity,
        targetStatus,
      })}
      desc={t('dialogs.confirmStatusChangeBulkDesc')}
      confirmText={
        updateStatusMutation.isPending
          ? t('dialogs.changing')
          : t('dialogs.changeAll')
      }
      isLoading={updateStatusMutation.isPending}
    />
  )
}
