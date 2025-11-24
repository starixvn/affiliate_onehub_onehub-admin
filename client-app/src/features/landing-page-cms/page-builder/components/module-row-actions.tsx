import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

type ModuleRowActionsProps = {
  isDisabled: boolean
  isFirstRow: boolean
  onAdd: () => void
  onRemove: () => void
}

export function ModuleRowActions({ isDisabled, isFirstRow, onAdd, onRemove }: ModuleRowActionsProps) {
  const { t } = useTranslation('page-builder')

  return (
    <div className='col-span-3 flex justify-center gap-1'>
      <Button
        size='sm'
        variant='outline'
        className='h-8 px-1.5 md:px-2 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 min-w-[2rem] md:min-w-0'
        disabled={isDisabled}
        onClick={onAdd}
        type='button'
      >
        <span>+</span>
        <span className='hidden md:inline'>{t('form.add')}</span>
      </Button>
      <Button
        size='sm'
        variant='outline'
        className='h-8 px-1.5 md:px-2 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 min-w-[2rem] md:min-w-0'
        disabled={isDisabled || isFirstRow}
        onClick={onRemove}
        type='button'
      >
        <span>-</span>
        <span className='hidden md:inline'>{t('form.remove')}</span>
      </Button>
    </div>
  )
}

