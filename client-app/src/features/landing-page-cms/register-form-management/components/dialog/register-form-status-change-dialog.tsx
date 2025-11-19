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
import { useUpdateRegisterFormsStatus } from '../../api/commands'
import type { RegisterFormDetail } from '../../data/schema'

interface RegisterFormStatusChangeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  registerForm: RegisterFormDetail | null
  newStatusId: number
}

export function RegisterFormStatusChangeDialog({
  open,
  onOpenChange,
  registerForm,
  newStatusId,
}: RegisterFormStatusChangeDialogProps) {
  const { t } = useTranslation('register-form-management')
  const updateStatusMutation = useUpdateRegisterFormsStatus()

  const handleConfirm = () => {
    if (registerForm) {
      updateStatusMutation.mutate({
        ids: registerForm.mediaId.toString(),
        statusId: newStatusId,
      })
      onOpenChange(false)
    }
  }

  if (!registerForm) return null

  const newStatusText = newStatusId === 1 ? t('table.active') : t('table.inactive')

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('dialogs.confirmStatusChange', {
              formName: registerForm.mediaName,
              status: newStatusText,
            })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('dialogs.confirmStatusChange', {
              formName: registerForm.mediaName,
              status: newStatusText,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('actions.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={updateStatusMutation.isPending}
          >
            {updateStatusMutation.isPending
              ? t('dialogs.changing')
              : t('dialogs.change')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
