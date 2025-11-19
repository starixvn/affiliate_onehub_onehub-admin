import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog'

interface RegisterFormActionButtonsProps {
  isEdit: boolean
  isFormValid: boolean
  isLoading: boolean
  onSubmit: () => void
  onCancel: () => void
}

export function RegisterFormActionButtons({
  isEdit,
  isFormValid,
  isLoading,
  onSubmit,
  onCancel,
}: RegisterFormActionButtonsProps) {
  const { t } = useTranslation('register-form-management')

  return (
    <DialogFooter>
      <Button
        type='button'
        onClick={onSubmit}
        disabled={!isFormValid || isLoading}
      >
        {isLoading
          ? t('actions.saving')
          : isEdit
          ? t('actions.update')
          : t('actions.create')}
      </Button>
      <DialogClose asChild>
        <Button type='button' variant='outline' onClick={onCancel}>
          {t('actions.cancel')}
        </Button>
      </DialogClose>
    </DialogFooter>
  )
}
