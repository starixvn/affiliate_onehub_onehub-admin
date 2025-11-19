import { useTranslation } from 'react-i18next'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ValidationErrors, TouchedFields } from '../../data/schema'

interface RegisterFormBasicFieldsProps {
  isMediaIdInUse: boolean
  countryOptions: { value: string; label: string }[]
  languageOptions: { value: string; label: string }[]
  country: string
  language: string
  errors: ValidationErrors
  touched: TouchedFields
  onCountryChange: (value: string) => void
  onLanguageChange: (value: string) => void
  onCountryBlur: () => void
  onLanguageBlur: () => void
}

export function RegisterFormBasicFields({
  isMediaIdInUse,
  countryOptions,
  languageOptions,
  country,
  language,
  errors,
  touched,
  onCountryChange,
  onLanguageChange,
  onCountryBlur,
  onLanguageBlur,
}: RegisterFormBasicFieldsProps) {
  const { t } = useTranslation('register-form-management')

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
      <div className='space-y-2'>
        <Label htmlFor='country'>
          {t('form.country')} <span className='text-destructive'>*</span>
        </Label>
        <Select
          value={country}
          onValueChange={onCountryChange}
          onOpenChange={(open) => {
            if (!open && !touched.country) {
              onCountryBlur()
            }
          }}
        >
          <SelectTrigger
            id='country'
            title={t('form.countryPlaceholder')}
            className={
              touched.country && errors.country ? 'border-destructive' : ''
            }
          >
            <SelectValue placeholder={t('form.countryPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {countryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {touched.country && errors.country && (
          <p className='text-destructive text-xs'>{errors.country}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='language'>
          {t('form.language')} <span className='text-destructive'>*</span>
        </Label>
        <Select
          value={language}
          onValueChange={onLanguageChange}
          onOpenChange={(open) => {
            if (!open && !touched.language) {
              onLanguageBlur()
            }
          }}
          disabled={isMediaIdInUse || !country}
        >
          <SelectTrigger
            id='language'
            title={t('form.languagePlaceholder')}
            className={
              touched.language && errors.language ? 'border-destructive' : ''
            }
          >
            <SelectValue placeholder={t('form.languagePlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {languageOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {touched.language && errors.language && (
          <p className='text-destructive text-xs'>{errors.language}</p>
        )}
      </div>
    </div>
  )
}
