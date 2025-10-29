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
  return (
    <div className='flex flex-col gap-2 border-t pt-4 sm:flex-row sm:justify-end'>
      <Button
        type='button'
        variant='default'
        onClick={onSubmit}
        disabled={!isFormValid || isLoading}
        className='w-full sm:w-auto'
      >
        {isLoading ? 'Processing...' : isEdit ? 'Save Changes' : 'Add Asset'}
      </Button>
      <Button
        type='button'
        variant='outline'
        onClick={onCancel}
        disabled={isLoading}
        className='w-full sm:w-auto'
      >
        Cancel
      </Button>
    </div>
  )
}
