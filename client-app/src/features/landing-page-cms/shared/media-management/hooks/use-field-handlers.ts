import type { ValidationErrors, TouchedFields } from '../schema'
import type { Country, Language } from '../schema'

interface UseFieldHandlersProps<TFormData> {
  country: string
  language: string
  formData: TFormData
  isEdit: boolean
  countries: Country[]
  languages: Language[]
  setLanguageOptions: React.Dispatch<
    React.SetStateAction<{ value: string; label: string }[]>
  >
  setCountry: React.Dispatch<React.SetStateAction<string>>
  setLanguage: React.Dispatch<React.SetStateAction<string>>
  setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>
  setTouched: React.Dispatch<React.SetStateAction<TouchedFields>>
  validateField: (
    field: string,
    value: any,
    setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>,
    index?: number
  ) => void
  validateForm: (
    country: string,
    language: string,
    formData: TFormData,
    setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>,
    setTouched: React.Dispatch<React.SetStateAction<TouchedFields>>
  ) => boolean
  isFormValid: (
    country: string,
    language: string,
    formData: TFormData,
    isEdit: boolean
  ) => boolean
  resetFileErrors?: (
    setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>
  ) => void
  markFieldTouched?: (field: 'country' | 'language', index?: number) => void
  getInitialLanguage?: (
    languageByCountry: Language[],
    selectedCountry?: Country
  ) => string
}

export function useFieldHandlers<TFormData>({
  country,
  language,
  formData,
  isEdit,
  countries,
  languages,
  setLanguageOptions,
  setCountry,
  setLanguage,
  setErrors,
  setTouched,
  validateField,
  validateForm,
  isFormValid,
  resetFileErrors,
  markFieldTouched,
  getInitialLanguage,
}: UseFieldHandlersProps<TFormData>) {
  const handleCountryChange = (value: string) => {
    setCountry(value)
    validateField('country', value, setErrors)
    resetFileErrors?.(setErrors)

    const selectedCountry = countries.find(
      (country) => country.targetCountryCode === value
    )

    const languageByCountry = languages
      .filter((lang) => lang.targetCountryCode === value)
      .sort((a, b) => {
        const aMatch = a.languageCode === selectedCountry?.languageCode
        const bMatch = b.languageCode === selectedCountry?.languageCode

        if (aMatch && !bMatch) return -1
        if (!aMatch && bMatch) return 1
        return 0
      })

    if (languageByCountry.length > 0) {
      setLanguageOptions(
        languageByCountry.map((language) => ({
          value: language.languageCode,
          label: language.languageName,
        }))
      )

      const initialLanguage = getInitialLanguage
        ? getInitialLanguage(languageByCountry, selectedCountry)
        : languageByCountry[0].languageCode

      setLanguage(initialLanguage)
    }
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    validateField('language', value, setErrors)
    resetFileErrors?.(setErrors)
  }

  const handleCountryBlur = () => {
    if (markFieldTouched) {
      markFieldTouched('country')
    } else {
      setTouched((prev) => ({ ...prev, country: true }))
    }
    validateField('country', country, setErrors)
  }

  const handleLanguageBlur = () => {
    if (markFieldTouched) {
      markFieldTouched('language')
    } else {
      setTouched((prev) => ({ ...prev, language: true }))
    }
    validateField('language', language, setErrors)
  }

  const validateFormWrapper = (): boolean => {
    return validateForm(country, language, formData, setErrors, setTouched)
  }

  const isFormValidWrapper = (): boolean => {
    return isFormValid(country, language, formData, isEdit)
  }

  return {
    handleCountryChange,
    handleLanguageChange,
    handleCountryBlur,
    handleLanguageBlur,
    validateForm: validateFormWrapper,
    isFormValid: isFormValidWrapper,
  }
}
