import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useRegisterFormManagement } from './registration-form-management-provider'

export function RegisterFormPrimaryButtons() {
  const { t } = useTranslation('registration-form-management')
  const { setOpen } = useRegisterFormManagement()

  return (
    <div className='flex gap-2'>
      <Button onClick={() => setOpen('upload')}>
        <Plus className='mr-2 h-4 w-4' />
        {t('buttons.addForm')}
      </Button>
    </div>
  )
}
