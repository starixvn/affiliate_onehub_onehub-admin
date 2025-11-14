import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteComponents } from '../../api/commands'
import { type Component } from '../../data/schema'

type ComponentMultiDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<Component>
}

export function ComponentMultiDeleteDialog({
  open,
  onOpenChange,
  table,
}: ComponentMultiDeleteDialogProps) {
  const { t } = useTranslation('component-management')
  const deleteMutation = useDeleteComponents()

  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = () => {
    const componentIds = selectedRows.map((row) => row.original.componentId)

    if (componentIds.length === 0) {
      return
    }

    deleteMutation.mutate(componentIds, {
      onSuccess: (response) => {
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
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          {t('dialog.multiDelete.title', { count: selectedRows.length })}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            {t('dialog.multiDelete.message')} <br />
            {t('dialog.multiDelete.description')}
          </p>

          <Alert variant='destructive'>
            <AlertTitle>{t('dialog.multiDelete.warning')}</AlertTitle>
            <AlertDescription>
              {t('dialog.multiDelete.warningMessage')}
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={t('dialog.multiDelete.confirm')}
      cancelBtnText={t('deleteDialog.cancel')}
      destructive
    />
  )
}
