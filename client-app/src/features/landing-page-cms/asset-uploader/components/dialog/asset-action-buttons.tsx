import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

interface AssetActionButtonsProps {
  isEdit: boolean
  isFormValid: boolean
  isLoading: boolean
  onSubmit: () => void
  onCancel: () => void
}

export function AssetActionButtons({
  isEdit,
  isFormValid,
  isLoading,
  onSubmit,
  onCancel,
}: AssetActionButtonsProps) {
  const { t } = useTranslation('asset-uploader')

  return (
    <div className='flex flex-col gap-2 border-t pt-4 sm:flex-row sm:justify-end'>
      <Button
        type='button'
        variant='default'
        onClick={onSubmit}
        disabled={!isFormValid || isLoading}
        className='w-full sm:w-auto'
      >
        {isLoading ? t('buttons.processing') : isEdit ? t('buttons.saveChanges') : t('buttons.addAsset')}
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
