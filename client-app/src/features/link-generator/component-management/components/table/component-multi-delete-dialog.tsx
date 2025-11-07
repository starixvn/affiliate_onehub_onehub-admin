import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  const [value, setValue] = useState('')
  const deleteMutation = useDeleteComponents()

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const CONFIRM_WORD = t('dialog.multiDelete.confirmWord')

  const handleDelete = () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(
        t('dialog.multiDeleteToast.confirmRequired', { word: CONFIRM_WORD })
      )
      return
    }

    const componentIds = selectedRows.map((row) => row.original.componentId)

    deleteMutation.mutate(componentIds, {
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
