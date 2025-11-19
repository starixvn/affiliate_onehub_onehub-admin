import type {
  FormWithFiles,
  TouchedFields,
  ValidationErrors,
} from '../../../data/schema'
import {
  validateField,
  validateForm as validateFormHelper,
  isFormValid as isFormValidHelper,
  resetFileErrors,
  useErrorMessages,
} from '../../../data/validation'
import type { Language } from '../../../types'

interface UseRegisterFormFieldHandlersProps {
  country: string
  language: string
  formWithFiles: FormWithFiles
  touched: TouchedFields
  isEdit: boolean
  languages: Language[]
  setLanguageOptions: React.Dispatch<
    React.SetStateAction<Array<{ value: string; label: string }>>
  >
  setCountry: React.Dispatch<React.SetStateAction<string>>
  setLanguage: React.Dispatch<React.SetStateAction<string>>
  setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>
  setTouched: React.Dispatch<React.SetStateAction<TouchedFields>>
}

export function useRegisterFormFieldHandlers({
  country,
  language,
  formWithFiles,
  touched,
  isEdit,
  languages,
  setLanguageOptions,
  setCountry,
  setLanguage,
  setErrors,
  setTouched,
}: UseRegisterFormFieldHandlersProps) {
  const errorMessages = useErrorMessages()

  const handleCountryChange = (value: string) => {
    setCountry(value)
    resetFileErrors(setErrors)

    validateField('country', value, setErrors, errorMessages)

    const filteredLanguages = languages.filter(
      (language) => language.targetCountryCode === value
    )
    setLanguageOptions(
      filteredLanguages.map((language) => ({
        value: language.languageCode,
        label: language.languageName,
      }))
    )
    setLanguage(
      filteredLanguages.length > 0 ? filteredLanguages[0].languageCode : ''
    )
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    resetFileErrors(setErrors)

    validateField('language', value, setErrors, errorMessages)
  }

  const handleCountryBlur = () => {
    if (!touched.country) {
      setTouched((prev) => ({ ...prev, country: true }))
      validateField('country', country, setErrors, errorMessages)
    }
  }

  const handleLanguageBlur = () => {
    if (!touched.language) {
      setTouched((prev) => ({ ...prev, language: true }))
      validateField('language', language, setErrors, errorMessages)
    }
  }

  const validateForm = (): boolean => {
    return validateFormHelper(
      country,
      language,
      formWithFiles,
      setErrors,
      setTouched,
      errorMessages
    )
  }

  const isFormValid = (): boolean => {
    return isFormValidHelper(country, language, formWithFiles, isEdit)
  }

  return {
    handleCountryChange,
    handleLanguageChange,
    handleCountryBlur,
    handleLanguageBlur,
    validateForm,
    isFormValid,
  }
}
