import { useTranslation } from 'react-i18next'
import type { ValidationErrors, TouchedFields, ModuleWithFiles } from './schema'
import {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE_MB,
  MAX_FILES_PER_MODULE,
  regSpecialCharacters,
  MAX_FILE_NAME_LENGTH,
} from './schema'

export const useErrorMessages = () => {
  const { t } = useTranslation('asset-uploader')

  return {
    COUNTRY_REQUIRED: t('validation.countryRequired'),
    LANGUAGE_REQUIRED: t('validation.languageRequired'),
    MODULE_REQUIRED: t('validation.moduleRequired'),
    UPLOAD_LIMIT_EXCEEDED: (maxFiles: number) =>
      t('validation.uploadLimitExceeded', { maxFiles }),
    INVALID_FILE_TYPES: (invalidFiles: string[]) =>
      t('validation.invalidFileTypes', {
        invalidFiles: invalidFiles.join(', '),
      }),
    FILE_SIZE_EXCEEDED: (exceededFiles: string[]) =>
      t('validation.fileSizeExceeded', {
        maxSize: MAX_FILE_SIZE_MB,
        exceededFiles: exceededFiles.join(', '),
      }),
    DUPLICATE_FILE_NAMES: (duplicateFiles: string[]) =>
      t('validation.duplicateFileNames', {
        duplicateFiles: duplicateFiles.join(', '),
      }),
    INVALID_FILE_NAMES: (invalidFiles: string[]) =>
      t('validation.invalidFileNames', {
        invalidFiles: invalidFiles.join(', '),
      }),
    FILE_NAME_TOO_LONG: (longFiles: string[]) =>
      t('validation.fileNameTooLong', {
        longFiles: longFiles.join(', '),
        maxLength: MAX_FILE_NAME_LENGTH,
      }),
  }
}


export const INITIAL_VALIDATION_STATE = {
  errors: { modules: {} } as ValidationErrors,
  touched: { country: false, language: false, modules: {} } as TouchedFields,
}

export const resetFileErrors = (
  setErrors: (fn: (prev: ValidationErrors) => ValidationErrors) => void
) => {
  setErrors((prev) => ({ ...prev, files: undefined }))
}

export const validateField = (
  field: string,
  value: any,
  setErrors: (fn: (prev: ValidationErrors) => ValidationErrors) => void,
  errorMessages: ReturnType<typeof useErrorMessages>,
  index?: number
): boolean => {
  const errorMap = {
    country: !value ? errorMessages.COUNTRY_REQUIRED : '',
    language: !value ? errorMessages.LANGUAGE_REQUIRED : '',
    module: !value ? errorMessages.MODULE_REQUIRED : '',
  }

  const error = errorMap[field as keyof typeof errorMap] || ''

  if (field === 'module' && index !== undefined) {
    setErrors((prev) => ({
      ...prev,
      modules: { ...prev.modules, [index]: error },
    }))
  } else {
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  return !error
}

export const validateForm = (
  country: string,
  language: string,
  moduleRows: ModuleWithFiles[],
  setErrors: (errors: ValidationErrors) => void,
  errorMessages: ReturnType<typeof useErrorMessages>
): boolean => {
  const newErrors: ValidationErrors = { modules: {} }
  let isValid = true

  if (!country) {
    newErrors.country = errorMessages.COUNTRY_REQUIRED
    isValid = false
  }

  if (!language) {
    newErrors.language = errorMessages.LANGUAGE_REQUIRED
    isValid = false
  }

  moduleRows.forEach((row, index) => {
    if (!row.module) {
      newErrors.modules[index] = errorMessages.MODULE_REQUIRED
      isValid = false
    }
  })

  const fileErrors = validateFiles(moduleRows, errorMessages)
  if (fileErrors) {
    newErrors.files = fileErrors
    isValid = false
  }

  setErrors(newErrors)
  return isValid
}

export const isFormValid = (
  country: string,
  language: string,
  fileName: string,
  moduleRows: ModuleWithFiles[],
  isEdit: boolean
): boolean => {
  const hasRequiredFields =
    country && language && moduleRows.every((row) => row.module)

  if (!hasRequiredFields) return false

  return isEdit
    ? !!fileName
    : moduleRows.some((row) => row.files.length > 0 && row.module)
}

const getFileExtension = (fileName: string): string => {
  return fileName.toLowerCase().substring(fileName.lastIndexOf('.'))
}

export const validateFiles = (
  moduleRows: ModuleWithFiles[],
  errorMessages: ReturnType<typeof useErrorMessages>
): ValidationErrors['files'] => {
  const errors: ValidationErrors['files'] = {}

  const invalidFiles: string[] = []
  const exceededFiles: string[] = []
  const allFileNames: string[] = []
  const duplicateFiles: string[] = []
  const invalidFileNames: string[] = []
  const longFileNames: string[] = []

  let totalFiles = 0
  const maxSizeBytes = MAX_FILE_SIZE_MB * 1024 * 1024

  moduleRows.forEach((row) => {
    row.files.forEach((file) => {
      totalFiles++

      const extension = getFileExtension(file.name)
      if (!ALLOWED_FILE_TYPES.includes(extension as any)) {
        if (!invalidFiles.includes(file.name)) {
          invalidFiles.push(file.name)
        }
      }

      if (file.size > maxSizeBytes) {
        if (!exceededFiles.includes(file.name)) {
          exceededFiles.push(file.name)
        }
      }

      if (allFileNames.includes(file.name)) {
        if (!duplicateFiles.includes(file.name)) {
          duplicateFiles.push(file.name)
        }
      } else {
        allFileNames.push(file.name)
      }

      const specialCharsRegex = new RegExp(regSpecialCharacters)
      if (specialCharsRegex.test(file.name)) {
        if (!invalidFileNames.includes(file.name)) {
          invalidFileNames.push(file.name)
        }
      }

      if (file.name.length > MAX_FILE_NAME_LENGTH) {
        if (!longFileNames.includes(file.name)) {
          longFileNames.push(file.name)
        }
      }
    })
  })

  if (totalFiles > MAX_FILES_PER_MODULE) {
    errors.uploadLimitExceeded = errorMessages.UPLOAD_LIMIT_EXCEEDED(MAX_FILES_PER_MODULE)
  }

  if (invalidFiles.length > 0) {
    errors.invalidFileTypes = errorMessages.INVALID_FILE_TYPES(invalidFiles)
  }

  if (exceededFiles.length > 0) {
    errors.fileSizeExceeded = errorMessages.FILE_SIZE_EXCEEDED(exceededFiles)
  }

  if (duplicateFiles.length > 0) {
    errors.duplicateFileNames = errorMessages.DUPLICATE_FILE_NAMES(duplicateFiles)
  }

  if (invalidFileNames.length > 0) {
    errors.invalidFileNames = errorMessages.INVALID_FILE_NAMES(invalidFileNames)
  }

  if (longFileNames.length > 0) {
    errors.fileNameTooLong = errorMessages.FILE_NAME_TOO_LONG(longFileNames)
  }

  return Object.keys(errors).length > 0 ? errors : undefined
}
