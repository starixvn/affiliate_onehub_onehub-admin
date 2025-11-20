import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

interface MediaDialogActionButtonProps {
  translationKey: string
  isEdit: boolean
  isFormValid: boolean
  isLoading: boolean
  onSubmit: () => void
  onCancel: () => void
}

export function MediaDialogActionButton({
  translationKey,
  isEdit,
  isFormValid,
  isLoading,
  onSubmit,
  onCancel,
}: MediaDialogActionButtonProps) {
  const { t } = useTranslation(translationKey)

  return (
    <div className='flex flex-col gap-2 border-t pt-4 sm:flex-row sm:justify-end'>
      <Button
        type='button'
        variant='default'
        onClick={onSubmit}
        disabled={!isFormValid || isLoading}
        className='w-full sm:w-auto'
      >
        {isLoading
          ? t('buttons.processing')
          : isEdit
            ? t('buttons.save')
            : t('buttons.add')}
      </Button>
      <Button
        type='button'
        variant='outline'
        onClick={onCancel}
        disabled={isLoading}
        className='w-full sm:w-auto'
      >
        {t('buttons.cancel')}
      </Button>
    </div>
  )
}
