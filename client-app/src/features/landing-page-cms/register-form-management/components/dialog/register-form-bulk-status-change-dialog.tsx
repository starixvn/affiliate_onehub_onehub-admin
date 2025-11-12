import { type Table } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useUpdateRegisterFormsStatus } from '../../api/commands'
import type { RegisterFormDetail } from '../../data/schema'

type RegisterFormBulkStatusChangeDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<RegisterFormDetail>
  newStatusId: number
}

export function RegisterFormBulkStatusChangeDialog({
  open,
  onOpenChange,
  table,
  newStatusId,
}: RegisterFormBulkStatusChangeDialogProps) {
  const { t } = useTranslation('register-form-management')
  const updateStatusMutation = useUpdateRegisterFormsStatus()
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleStatusChange = () => {
    const affectedForms = selectedRows.filter(
      (row) => row.original.statusId !== newStatusId
    )

    const formIds = affectedForms
      .map((row) => row.original.mediaId.toString())
      .join(',')

    updateStatusMutation.mutate(
      { ids: formIds, statusId: newStatusId },
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
      desc={`${statusText} ${affectedCount} ${affectedCount > 1 ? 'forms' : 'form'}.`}
      confirmText={
        updateStatusMutation.isPending
          ? t('dialogs.changing')
          : t('dialogs.changeAll')
      }
      isLoading={updateStatusMutation.isPending}
    />
  )
}
