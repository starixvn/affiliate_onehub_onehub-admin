import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteRegisterForm } from '../../api/commands'
import type { RegisterFormDetail } from '../../data/schema'

interface DeleteRegisterFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  registerForm: RegisterFormDetail | null
}

export function DeleteRegisterFormDialog({
  open,
  onOpenChange,
  registerForm,
}: DeleteRegisterFormDialogProps) {
  const { t } = useTranslation('register-form-management')
  const deleteMutation = useDeleteRegisterForm()

  const handleConfirm = () => {
    if (registerForm) {
      deleteMutation.mutate(registerForm.mediaId.toString(), {
        onSuccess: (response) => {
          if (response.errorCode === 0) {
            onOpenChange(false)
          }
        },
      })
    }
  }

  if (!registerForm) return null

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleConfirm}
      disabled={deleteMutation.isPending}
      title={t('dialogs.confirmDeleteSingle', {
        formName: registerForm.mediaName,
      })}
      desc={t('dialogs.deleteDescription')}
      confirmText={
        deleteMutation.isPending ? t('dialogs.deleting') : t('dialogs.delete')
      }
      destructive
      isLoading={deleteMutation.isPending}
    />
  )
}
