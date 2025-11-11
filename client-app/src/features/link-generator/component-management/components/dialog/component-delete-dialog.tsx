import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteComponent } from '../../api/commands'
import { useComponents } from '../component-provider'

export function ComponentDeleteDialog() {
  const { t } = useTranslation('component-management')
  const { open, setOpen, currentRow } = useComponents()
  const deleteMutation = useDeleteComponent()

  const handleDelete = () => {
    if (!currentRow) return

    deleteMutation.mutate(currentRow.componentId, {
      onSuccess: () => {
        setOpen(null)
      },
    })
  }

  if (!currentRow) return null

  return (
    <ConfirmDialog
      open={open === 'delete'}
      onOpenChange={(isOpen) => setOpen(isOpen ? 'delete' : null)}
      handleConfirm={handleDelete}
      disabled={deleteMutation.isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          {t('deleteDialog.title')}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            {t('deleteDialog.description', {
              name: currentRow.componentName,
            })}
          </p>

          <Alert variant='destructive'>
            <AlertTitle>{t('deleteDialog.warning')}</AlertTitle>
            <AlertDescription>
              {t('deleteDialog.warningMessage')}
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={t('deleteDialog.confirm')}
      cancelBtnText={t('deleteDialog.cancel')}
      destructive
    />
  )
}
