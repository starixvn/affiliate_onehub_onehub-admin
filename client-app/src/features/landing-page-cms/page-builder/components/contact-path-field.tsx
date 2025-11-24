import { Controller, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { FormFieldError } from './form-field-error'
import type { PageBuilderFormValues } from '../data/schema'

type ContactPathFieldProps = {
  index: number
  form: UseFormReturn<PageBuilderFormValues>
  isDisabled: boolean
}

export function ContactPathField({ index, form, isDisabled }: ContactPathFieldProps) {
  const { t } = useTranslation('page-builder')
  const { control, formState: { errors } } = form

  return (
    <div className='grid grid-cols-12 gap-2 items-start pb-0'>
      <div className='col-span-1'></div>
      <div className='col-span-4 flex justify-end'>
        <Label htmlFor={`contactPath-${index}`} className='text-right pt-2.5'>
          {t('form.contact')} <span className='text-destructive'>{t('form.requiredField')}</span>
        </Label>
      </div>
      <div className='col-span-4'>
        <Controller
          name={`modules.${index}.contactPath`}
          control={control}
          render={({ field }) => (
            <Input
              id={`contactPath-${index}`}
              placeholder={t('form.contactPathPlaceholder')}
              {...field}
              disabled={isDisabled}
              className={cn(
                errors.modules?.[index]?.contactPath ? 'border-destructive focus-visible:border-destructive' : ''
              )}
            />
          )}
        />
        <FormFieldError message={errors.modules?.[index]?.contactPath?.message} />
      </div>
      <div className='col-span-3'></div>
    </div>
  )
}

