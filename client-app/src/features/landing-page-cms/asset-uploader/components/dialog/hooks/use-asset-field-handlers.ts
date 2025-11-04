import type { ValidationErrors, TouchedFields } from '../../../data/schema'
import {
  validateField as validateFieldHelper,
  validateForm as validateFormHelper,
  isFormValid as isFormValidHelper,
} from '../../../data/validation'
import type { Language } from '../../../types'

interface UseAssetFieldHandlersProps {
  country: string
  language: string
  fileName: string
  moduleRows: Array<{ module: string; files: File[] }>
  isEdit: boolean
  languages: Language[]
  setLanguageOptions: React.Dispatch<
    React.SetStateAction<{ value: string; label: string }[]>
  >
  setCountry: React.Dispatch<React.SetStateAction<string>>
  setLanguage: React.Dispatch<React.SetStateAction<string>>
  setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>
  setTouched: React.Dispatch<React.SetStateAction<TouchedFields>>
}

export function useAssetFieldHandlers({
  country,
  language,
  fileName,
  moduleRows,
  isEdit,
  languages,
  setLanguageOptions,
  setCountry,
  setLanguage,
  setErrors,
  setTouched,
}: UseAssetFieldHandlersProps) {
  const markFieldTouched = (field: 'country' | 'language', index?: number) => {
    if (index !== undefined) {
      setTouched((prev) => ({
        ...prev,
        modules: { ...prev.modules, [index]: true },
      }))
    } else {
      setTouched((prev) => ({ ...prev, [field]: true }))
    }
  }

  const validateField = (field: string, value: any, index?: number) => {
    return validateFieldHelper(field, value, setErrors, index)
  }

  const validateForm = (): boolean => {
    return validateFormHelper(country, language, moduleRows, setErrors)
  }

  const isFormValid = () => {
    return isFormValidHelper(country, language, fileName, moduleRows, isEdit)
  }

  const handleCountryChange = (value: string) => {
    setCountry(value)
    validateField('country', value)
    const languageByCountry = languages.filter(
      (language) => language.targetCountryCode === value
    )
    if (languageByCountry.length > 0) {
      setLanguageOptions(
        languageByCountry.map((language) => ({
          value: language.languageCode,
          label: language.languageName,
        }))
      )
      setLanguage(languageByCountry[0].languageCode)
    }
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    validateField('language', value)
  }

  const handleCountryBlur = () => {
    markFieldTouched('country')
    validateField('country', country)
  }

  const handleLanguageBlur = () => {
    markFieldTouched('language')
    validateField('language', language)
  }

  return {
    markFieldTouched,
    validateField,
    validateForm,
    isFormValid,
    handleCountryChange,
    handleLanguageChange,
    handleCountryBlur,
    handleLanguageBlur,
  }
}
