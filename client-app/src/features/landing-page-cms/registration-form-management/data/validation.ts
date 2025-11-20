import {
  createErrorMessages,
  createInitialValidationState,
  resetFileErrors,
  validateField,
  validateForm,
  isFormValid,
  validateFiles,
  DEFAULT_FILE_UPLOAD_CONFIG,
} from '@/features/landing-page-cms/shared'
import {
  TRANSLATION_KEY,
  type ValidationErrors,
  type TouchedFields,
  type FormWithFiles,
} from './schema'

export { resetFileErrors }

export const useErrorMessages = createErrorMessages(TRANSLATION_KEY)

export const INITIAL_VALIDATION_STATE =
  createInitialValidationState('formNames')

export const validateRegistrationFormField = (
  field: string,
  value: string,
  setErrors: (fn: (prev: ValidationErrors) => ValidationErrors) => void,
  errorMessages: ReturnType<typeof useErrorMessages>,
  index?: number
): boolean => {
  return validateField(
    field,
    value,
    setErrors,
    errorMessages,
    'formNames',
    index
  )
}

export const validateRegistrationForm = (
  country: string,
  language: string,
  formWithFiles: FormWithFiles,
  setErrors: (errors: ValidationErrors) => void,
  setTouched: (touched: TouchedFields) => void,
  errorMessages: ReturnType<typeof useErrorMessages>,
  isEdit: boolean,
  config = DEFAULT_FILE_UPLOAD_CONFIG
): boolean => {
  return validateForm(
    country,
    language,
    formWithFiles,
    setErrors,
    setTouched,
    errorMessages,
    config,
    'formNames',
    isEdit
  )
}

export const isRegistrationFormValid = (
  country: string,
  language: string,
  formWithFiles: FormWithFiles,
  isEdit: boolean
): boolean => {
  return isFormValid(country, language, formWithFiles, isEdit, 'formNames')
}

export const validateRegistrationFormFiles = (
  formFiles: FormWithFiles['files'],
  errorMessages: ReturnType<typeof useErrorMessages>,
  config = DEFAULT_FILE_UPLOAD_CONFIG
): ValidationErrors['files'] => {
  return validateFiles(formFiles, errorMessages, config, 'formNames')
}
