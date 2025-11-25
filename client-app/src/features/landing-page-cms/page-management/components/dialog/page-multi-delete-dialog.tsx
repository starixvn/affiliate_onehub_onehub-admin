import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteBatchLandingPages } from '../../api/commands'
import { type LandingPage } from '../../data/schema'

type PageMultiDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<LandingPage>
}

export function PageMultiDeleteDialog({
  open,
  onOpenChange,
  table,
}: PageMultiDeleteDialogProps) {
  const { t } = useTranslation('page-management')
  const deleteMutation = useDeleteBatchLandingPages()

  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = () => {
    const pageIds = selectedRows
      .map((row) => row.original.pageId.toString())
      .join(',')

    deleteMutation.mutate(
      { pageIds },
      {
        onSuccess: () => {
          table.resetRowSelection()
          onOpenChange(false)
        },
      }
    )
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
      destructive
    />
  )
}
