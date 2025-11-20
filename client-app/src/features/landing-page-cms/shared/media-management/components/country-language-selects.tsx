import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ValidationErrors, TouchedFields } from '../schema'

interface CountryLanguageSelectsProps {
  translationKey: string
  isMediaIdInUse: boolean
  module?: string
  errors: ValidationErrors
  touched: TouchedFields
  countryOptions: { value: string; label: string }[]
  languageOptions: { value: string; label: string }[]
  country: string
  language: string
  onCountryChange: (value: string) => void
  onLanguageChange: (value: string) => void
  onCountryBlur: () => void
  onLanguageBlur: () => void
  showModuleField?: boolean
}

export function CountryLanguageSelects({
  translationKey,
  isMediaIdInUse,
  module,
  errors,
  touched,
  countryOptions,
  languageOptions,
  country,
  language,
  onCountryChange,
  onLanguageChange,
  onCountryBlur,
  onLanguageBlur,
  showModuleField = false,
}: CountryLanguageSelectsProps) {
  const { t } = useTranslation(translationKey)

  const gridCols = showModuleField ? 'sm:grid-cols-3' : 'sm:grid-cols-2'

  return (
    <div className={`grid grid-cols-1 gap-4 ${gridCols}`}>
      {showModuleField && module && (
        <div className='space-y-2'>
          <Label htmlFor='module'>{t('form.module')}</Label>
          <Input id='module' value={module} disabled className='bg-muted' />
        </div>
      )}

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
          disabled={isMediaIdInUse}
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
          value={language}
          onValueChange={onLanguageChange}
          onOpenChange={(open) => {
            if (!open && !touched.language) {
              onLanguageBlur()
            }
          }}
          disabled={isMediaIdInUse || !country || languageOptions.length === 0}
        >
          <SelectTrigger
            id='language'
            title={t('form.languagePlaceholder')}
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
