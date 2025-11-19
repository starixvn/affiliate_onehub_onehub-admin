'use client'

import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteLandingPage } from '../../api/commands'
import { type LandingPage } from '../../data/schema'

type PageDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: LandingPage
}

export function PageDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: PageDeleteDialogProps) {
  const { t } = useTranslation('page-management')
  const deleteMutation = useDeleteLandingPage()

  const handleDelete = () => {
    deleteMutation.mutate(currentRow.pageId, {
      onSuccess: (response) => {
        if (response.errorCode === 0) {
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
          {t('dialog.delete.title')}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            {t('dialog.delete.message')}{' '}
            <span className='font-bold'>{currentRow.lpName}</span>?
            <br />
            {t('dialog.delete.description')}
          </p>

          <Alert variant='destructive'>
            <AlertTitle>{t('dialog.delete.warning')}</AlertTitle>
            <AlertDescription>
              {t('dialog.delete.warningMessage')}
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={t('dialog.delete.confirm')}
      destructive
    />
  )
}

