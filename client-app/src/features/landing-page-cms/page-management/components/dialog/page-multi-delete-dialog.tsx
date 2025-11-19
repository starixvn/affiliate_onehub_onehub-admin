import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  const [value, setValue] = useState('')
  const deleteMutation = useDeleteBatchLandingPages()

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const CONFIRM_WORD = t('dialog.multiDelete.confirmWord')

  const handleDelete = () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(
        t('dialog.multiDeleteToast.confirmRequired', { word: CONFIRM_WORD })
      )
      return
    }

    const pageIds = selectedRows.map((row) => row.original.pageId.toString()).join(',')

    deleteMutation.mutate({ pageIds }, {
      onSuccess: (response) => {
        if (response.errorCode === 0) {
          table.resetRowSelection()
          setValue('')
          onOpenChange(false)
        }
      },
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen)
        if (!isOpen) {
          setValue('')
        }
      }}
      handleConfirm={handleDelete}
      disabled={value.trim() !== CONFIRM_WORD || deleteMutation.isPending}
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

          <Label className='my-4 flex flex-col items-start gap-1.5'>
            <span>
              {t('dialog.multiDelete.confirmLabel', { word: CONFIRM_WORD })}
            </span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t('dialog.multiDelete.confirmPlaceholder', {
                word: CONFIRM_WORD,
              })}
            />
          </Label>

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

