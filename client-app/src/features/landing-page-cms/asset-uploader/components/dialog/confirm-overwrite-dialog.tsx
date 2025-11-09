import { useTranslation } from 'react-i18next'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

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
  const { t } = useTranslation('asset-uploader')

  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('dialogs.confirmOverwriteTitle', 'Confirm Overwrite')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('dialogs.confirmOverwriteMessage', {
              fileName,
              defaultValue: 'This file name "{{fileName}}" already exists. Do you want to overwrite the current file?',
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {t('common.cancel', 'Cancel')}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {t('common.confirm', 'Confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
