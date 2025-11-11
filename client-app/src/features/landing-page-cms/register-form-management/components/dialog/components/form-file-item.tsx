import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type {
  ValidationErrors,
  TouchedFields,
  FormFile,
} from '../../../data/schema'

interface FormFileItemProps {
  index: number
  formFile: FormFile
  errors: ValidationErrors
  touched: TouchedFields
  isEdit: boolean
  onFormNameChange: (index: number, value: string) => void
  onFormNameBlur: (index: number) => void
  onRemoveFile: (fileIndex: number) => void
}

export function FormFileItem({
  index,
  formFile,
  errors,
  touched,
  isEdit,
  onFormNameChange,
  onFormNameBlur,
  onRemoveFile,
}: FormFileItemProps) {
  const { t } = useTranslation('register-form-management')

  return (
    <div className='bg-card rounded-lg border p-4'>
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor={`form-name-${index}`}>
            {t('form.formName')} {!isEdit ? ` ${index + 1}` : ''}
          </Label>
          <div className='flex gap-2'>
            <Input
              id={`form-name-${index}`}
              type='text'
              value={formFile.formName}
              onChange={(e) => onFormNameChange(index, e.target.value)}
              onBlur={() => onFormNameBlur(index)}
              placeholder={t('form.formNamePlaceholder')}
              className={
                touched.formNames[index] && errors.formNames?.[index]
                  ? 'border-destructive'
                  : ''
              }
              maxLength={200}
            />
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='h-10 w-10 flex-shrink-0 p-0 text-red-600 hover:text-red-700'
              onClick={() => onRemoveFile(index)}
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
          {touched.formNames[index] && errors.formNames?.[index] && (
            <p className='text-destructive text-xs'>
              {errors.formNames[index]}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <Label>{t('form.imagePreview')}</Label>
          <div className='bg-muted/20 rounded-lg border p-4'>
            <p className='text-sm font-medium'>{formFile.fileName}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
