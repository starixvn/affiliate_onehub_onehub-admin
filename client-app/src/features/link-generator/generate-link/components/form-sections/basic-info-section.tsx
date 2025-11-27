import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormFieldError } from '../form-field-error'
import { useGenerateLink } from '../generate-link-provider'

export function BasicInfoSection() {
  const { t } = useTranslation('link-generator')
  const { form, generatedResult } = useGenerateLink()
  const {
    register,
    formState: { errors },
  } = form
  const isDisabled = !!generatedResult

  return (
    <div className='border rounded-lg p-4'>
      <div className='grid gap-4 sm:gap-6 md:grid-cols-2'>
        <div className='space-y-1.5'>
          <Label htmlFor='linkName' className='text-sm'>
            {t('form.linkName')}{' '}
            <span className='text-destructive'>
              {t('form.requiredField')}
            </span>
          </Label>
          <Input
            id='linkName'
            placeholder={t('form.linkNamePlaceholder')}
            {...register('linkName')}
            maxLength={200}
            disabled={isDisabled}
          />
          <FormFieldError message={errors.linkName?.message} />
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='identifierCode' className='text-sm'>
            {t('form.identifierCode')}
          </Label>
          <Input
            id='identifierCode'
            placeholder={t('form.identifierCodePlaceholder')}
            {...register('identifierCode')}
            maxLength={20}
            disabled={isDisabled}
          />
          <FormFieldError message={errors.identifierCode?.message} />
        </div>
      </div>
    </div>
  )
}

