import type { ValidationErrors, TouchedFields, ModuleWithFiles } from './schema'
import {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE_MB,
  MAX_FILES_PER_MODULE,
} from './schema'

export const ERROR_MESSAGES = {
  COUNTRY_REQUIRED: 'Please select a Country',
  LANGUAGE_REQUIRED: 'Please select a Language',
  MODULE_REQUIRED: 'Please select a Module',
  UPLOAD_LIMIT_EXCEEDED: `Upload limit exceeded. You can only upload up to ${MAX_FILES_PER_MODULE} files at a time.`,
  INVALID_FILE_TYPES: (invalidFiles: string[]) =>
    `Invalid file type(s) detected: ${invalidFiles.join(', ')}. Please upload only GIF, JPG, JPEG, PNG or WEBP files.`,
  FILE_SIZE_EXCEEDED: (exceededFiles: string[]) =>
    `File size exceeds ${MAX_FILE_SIZE_MB}MB limit: ${exceededFiles.join(', ')}. Please upload a smaller file.`,
  DUPLICATE_FILE_NAMES: (duplicateFiles: string[]) =>
    `File name(s) already exists: ${duplicateFiles.join(', ')}. Please rename or remove the file(s) before uploading.`,
} as const

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
  index?: number
): boolean => {
  const errorMap = {
    country: !value ? ERROR_MESSAGES.COUNTRY_REQUIRED : '',
    language: !value ? ERROR_MESSAGES.LANGUAGE_REQUIRED : '',
    module: !value ? ERROR_MESSAGES.MODULE_REQUIRED : '',
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
  setErrors: (errors: ValidationErrors) => void
): boolean => {
  const newErrors: ValidationErrors = { modules: {} }
  let isValid = true

  if (!country) {
    newErrors.country = ERROR_MESSAGES.COUNTRY_REQUIRED
    isValid = false
  }

  if (!language) {
    newErrors.language = ERROR_MESSAGES.LANGUAGE_REQUIRED
    isValid = false
  }

  moduleRows.forEach((row, index) => {
    if (!row.module) {
      newErrors.modules[index] = ERROR_MESSAGES.MODULE_REQUIRED
      isValid = false
    }
  })

  const fileErrors = validateFiles(moduleRows)
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
  moduleRows: ModuleWithFiles[]
): ValidationErrors['files'] => {
  const errors: ValidationErrors['files'] = {}

  const invalidFiles: string[] = []
  const exceededFiles: string[] = []
  const allFileNames: string[] = []
  const duplicateFiles: string[] = []

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
    })
  })

  if (totalFiles > MAX_FILES_PER_MODULE) {
    errors.uploadLimitExceeded = ERROR_MESSAGES.UPLOAD_LIMIT_EXCEEDED
  }

  if (invalidFiles.length > 0) {
    errors.invalidFileTypes = ERROR_MESSAGES.INVALID_FILE_TYPES(invalidFiles)
  }

  if (exceededFiles.length > 0) {
    errors.fileSizeExceeded = ERROR_MESSAGES.FILE_SIZE_EXCEEDED(exceededFiles)
  }

  if (duplicateFiles.length > 0) {
    errors.duplicateFileNames =
      ERROR_MESSAGES.DUPLICATE_FILE_NAMES(duplicateFiles)
  }

  return Object.keys(errors).length > 0 ? errors : undefined
}
