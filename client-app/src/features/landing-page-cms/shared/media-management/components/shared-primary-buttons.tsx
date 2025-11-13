import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export interface SharedPrimaryButtonsProps {
  translationKey: string
  onOpenUpload: () => void
}

export function SharedPrimaryButtons({
  translationKey,
  onOpenUpload,
}: SharedPrimaryButtonsProps) {
  const { t } = useTranslation(translationKey)

  return (
    <div className='flex gap-2'>
      <Button onClick={onOpenUpload}>
        <Plus className='mr-2 h-4 w-4' />
        {t('buttons.create')}
      </Button>
    </div>
  )
}
