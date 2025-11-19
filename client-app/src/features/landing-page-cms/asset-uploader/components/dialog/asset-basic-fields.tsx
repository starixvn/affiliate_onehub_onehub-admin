import { useTranslation } from 'react-i18next'
// No hooks needed - fully controlled component
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ValidationErrors, TouchedFields } from '../../data/schema'

interface AssetBasicFieldsProps {
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

export function AssetBasicFields({
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
}: AssetBasicFieldsProps) {
  const { t } = useTranslation('asset-uploader')
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
      <div className='space-y-2'>
        <Label htmlFor='country'>{t('form.country')}</Label>
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
            className={
              touched.country && errors.country ? 'border-destructive' : ''
            }
          >
            <SelectValue placeholder={t('form.countryPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {countryOptions.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {touched.country && errors.country && (
          <p className='text-destructive text-xs'>{errors.country}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='language'>{t('form.language')}</Label>
        <Select
          disabled={!country || languageOptions.length === 0}
          value={language}
          onValueChange={onLanguageChange}
          onOpenChange={(open) => {
            if (!open && !touched.language) {
              onLanguageBlur()
            }
          }}
        >
          <SelectTrigger
            id='language'
            className={
              touched.language && errors.language ? 'border-destructive' : ''
            }
          >
            <SelectValue
              placeholder={
                !country || languageOptions.length === 0
                  ? t('form.languagePlaceholder')
                  : t('form.languagePlaceholder2')
              }
            />
          </SelectTrigger>
          <SelectContent>
            {languageOptions.map((l) => (
              <SelectItem key={l.value} value={l.value}>
                {l.label}
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
