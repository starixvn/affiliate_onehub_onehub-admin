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
      deleteMutation.mutate(registerForm.mediaId.toString())
      onOpenChange(false)
    }
  }

  if (!registerForm) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('dialogs.confirmDeleteSingle', {
              formName: registerForm.mediaName,
            })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('dialogs.confirmDelete')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('actions.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending
              ? t('dialogs.deleting')
              : t('dialogs.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
