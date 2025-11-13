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
import type {
  AssetModuleWithFiles,
  ValidationErrors,
  TouchedFields,
} from './schema'
import { TRANSLATION_KEY } from '../data/schema'

export { resetFileErrors }

export const useErrorMessages = createErrorMessages(TRANSLATION_KEY)

export const INITIAL_VALIDATION_STATE = createInitialValidationState('modules')

export const validateAssetField = (
  field: string,
  value: string,
  setErrors: (fn: (prev: ValidationErrors) => ValidationErrors) => void,
  errorMessages: ReturnType<typeof useErrorMessages>,
  index?: number
): boolean => {
  return validateField(field, value, setErrors, errorMessages, 'modules', index)
}

export const validateAssetForm = (
  country: string,
  language: string,
  moduleRows: AssetModuleWithFiles[],
  setErrors: (errors: ValidationErrors) => void,
  setTouched: (touched: TouchedFields) => void,
  errorMessages: ReturnType<typeof useErrorMessages>
): boolean => {
  return validateForm(
    country,
    language,
    moduleRows,
    setErrors,
    setTouched,
    errorMessages,
    DEFAULT_FILE_UPLOAD_CONFIG,
    'modules'
  )
}

export const isAssetFormValid = (
  country: string,
  language: string,
  moduleRows: AssetModuleWithFiles[],
  isEdit: boolean
): boolean => {
  return isFormValid(country, language, moduleRows, isEdit, 'modules')
}

export const validateAssetFiles = (
  moduleRows: AssetModuleWithFiles[],
  errorMessages: ReturnType<typeof useErrorMessages>
): ValidationErrors['files'] => {
  const allFiles = moduleRows.flatMap((row) => row.files)
  return validateFiles(
    allFiles,
    errorMessages,
    DEFAULT_FILE_UPLOAD_CONFIG,
    'modules'
  )
}
