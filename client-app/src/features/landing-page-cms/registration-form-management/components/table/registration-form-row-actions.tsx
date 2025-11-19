import { type Row } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { type RegisterFormDetail } from '../../data/schema'
import { useRegisterFormManagement } from '../registration-form-management-provider'

type RegisterFormRowActionsProps = {
  row: Row<RegisterFormDetail>
}

export function RegisterFormRowActions({ row }: RegisterFormRowActionsProps) {
  const { t } = useTranslation('registration-form-management')
  const { setOpen, setCurrentRow } = useRegisterFormManagement()

  return (
    <div className='flex items-center gap-2'>
      <Button
        variant='ghost'
        size='icon'
        className='h-8 w-8'
        title={t('buttons.editForm')}
        onClick={() => {
          setCurrentRow(row.original)
          setOpen('edit')
        }}
      >
        <Pencil className='h-4 w-4' />
      </Button>
      <Button
        disabled={row.original.isMediaIdInUse}
        variant='ghost'
        size='icon'
        className='h-8 w-8'
        title={t('buttons.deleteForm')}
        onClick={() => {
          if (!row.original.isMediaIdInUse) {
            setCurrentRow(row.original)
            setOpen('delete')
          }
        }}
      >
        <Trash2 className='h-4 w-4' />
      </Button>
    </div>
  )
}
