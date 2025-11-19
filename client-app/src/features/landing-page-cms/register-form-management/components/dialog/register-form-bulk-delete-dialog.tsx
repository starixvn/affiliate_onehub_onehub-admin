import { type Table } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteRegisterForms } from '../../api/commands'
import type { RegisterFormDetail } from '../../data/schema'

type RegisterFormBulkDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<RegisterFormDetail>
}

export function RegisterFormBulkDeleteDialog({
  open,
  onOpenChange,
  table,
}: RegisterFormBulkDeleteDialogProps) {
  const { t } = useTranslation('register-form-management')
  const deleteMutation = useDeleteRegisterForms()
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = () => {
    const associatedForms = selectedRows.filter((row) => {
      return row.original.isMediaIdInUse === true
    })
    if (associatedForms.length === selectedRows.length) {
      toast.error(t('toasts.deleteInUseError'))
      return
    }

    const unassociatedFormsIds = selectedRows
      .filter((row) => {
        return row.original.isMediaIdInUse === false
      })
      .map((row) => row.original.mediaId.toString())
      .join(',')

    deleteMutation.mutate(unassociatedFormsIds, {
      onSuccess: (response: { errorCode: number; message?: string }) => {
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
        entity: selectedRows.length > 1 ? 'forms' : 'form'
      })}
      desc={t('dialogs.deleteDescription')}
      confirmText={deleteMutation.isPending ? t('dialogs.deleting') : t('dialogs.deleteAll')}
      destructive
      isLoading={deleteMutation.isPending}
    />
  )
}
