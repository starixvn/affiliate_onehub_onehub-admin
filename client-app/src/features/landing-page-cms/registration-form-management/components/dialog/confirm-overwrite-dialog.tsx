import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '@/components/confirm-dialog'

interface ConfirmOverwriteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fileName: string
  onConfirm: () => void
  onCancel?: () => void
}

export function ConfirmOverwriteDialog({
  open,
  onOpenChange,
  fileName,
  onConfirm,
  onCancel,
}: ConfirmOverwriteDialogProps) {
  const { t } = useTranslation('registration-form-management')

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
      title={t('dialogs.confirmOverwriteTitle', 'Confirm Overwrite')}
      desc={t('dialogs.confirmOverwriteMessage', {
        fileName,
        defaultValue:
          'This file name "{{fileName}}" already exists. Do you want to overwrite the current file?',
      })}
      confirmText={t('common.confirm', 'Confirm')}
      cancelBtnText={t('common.cancel', 'Cancel')}
    />
  )
}
