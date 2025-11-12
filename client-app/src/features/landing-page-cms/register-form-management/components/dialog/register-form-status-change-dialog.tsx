import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '@/components/confirm-dialog'
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
      updateStatusMutation.mutate(
        {
          ids: registerForm.mediaId.toString(),
          statusId: newStatusId,
        },
        {
          onSuccess: (response) => {
            if (response.errorCode === 0) {
              onOpenChange(false)
            }
          },
        }
      )
    }
  }

  if (!registerForm) return null

  const newStatusText =
    newStatusId === 1 ? t('table.active') : t('table.inactive')

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleConfirm}
      disabled={updateStatusMutation.isPending}
      title={t('dialogs.confirmStatusChange', {
        formName: registerForm.mediaName,
        status: newStatusText,
      })}
      desc={''}
      confirmText={
        updateStatusMutation.isPending
          ? t('dialogs.changing')
          : t('dialogs.change')
      }
      isLoading={updateStatusMutation.isPending}
    />
  )
}
