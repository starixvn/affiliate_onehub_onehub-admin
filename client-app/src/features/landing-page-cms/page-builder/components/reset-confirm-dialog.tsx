import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '@/components/confirm-dialog'

type ResetConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function ResetConfirmDialog({ open, onOpenChange, onConfirm }: ResetConfirmDialogProps) {
  const { t } = useTranslation('page-builder')

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('dialog.resetForm.title')}
      desc={t('dialog.resetForm.description')}
      confirmText={t('dialog.resetForm.confirm')}
      cancelBtnText={t('dialog.resetForm.cancel')}
      handleConfirm={onConfirm}
    />
  )
}

