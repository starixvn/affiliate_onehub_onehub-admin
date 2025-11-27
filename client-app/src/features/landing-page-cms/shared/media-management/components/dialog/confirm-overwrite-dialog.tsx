import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '@/components/confirm-dialog'

interface ConfirmOverwriteDialogProps {
  translationKey: string
  open: boolean
  onOpenChange: (open: boolean) => void
  fileName: string
  onConfirm: () => void
  onCancel?: () => void
}

export function ConfirmOverwriteDialog({
  translationKey,
  open,
  onOpenChange,
  fileName,
  onConfirm,
  onCancel,
}: ConfirmOverwriteDialogProps) {
  const { t } = useTranslation(translationKey)

  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && open) {
      onCancel?.()
    }
    onOpenChange(newOpen)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={handleOpenChange}
      handleConfirm={handleConfirm}
      title={t('dialogs.confirmOverwriteTitle')}
      desc={t('dialogs.confirmOverwriteMessage', { fileName })}
      confirmText={t('buttons.ok')}
      cancelBtnText={t('buttons.cancel')}
    />
  )
}
