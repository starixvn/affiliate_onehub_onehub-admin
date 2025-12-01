import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '@/components/confirm-dialog'

type ResetConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isEditOrCloneMode?: boolean
}

export function ResetConfirmDialog({ open, onOpenChange, onConfirm, isEditOrCloneMode = false }: ResetConfirmDialogProps) {
  const { t } = useTranslation('page-builder')

  const descriptionKey = isEditOrCloneMode 
    ? 'dialog.resetForm.descriptionEditOrClone'
    : 'dialog.resetForm.description'

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('dialog.resetForm.title')}
      desc={t(descriptionKey)}
      confirmText={t('dialog.resetForm.confirm')}
      cancelBtnText={t('dialog.resetForm.cancel')}
      handleConfirm={onConfirm}
    />
  )
}

