import { useTranslation } from 'react-i18next'
import type {
  ValidationErrors,
  TouchedFields,
  FormWithFiles,
  FormFile,
} from './schema'
import {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE_MB,
  MAX_FILES_PER_MODULE,
  MAX_FILE_NAME_LENGTH,
  MAX_FORM_NAME_LENGTH,
  regSpecialCharacters,
} from './schema'

export const useErrorMessages = () => {
  const { t } = useTranslation('register-form-management')

  return {
    COUNTRY_REQUIRED: t('validation.countryRequired'),
    LANGUAGE_REQUIRED: t('validation.languageRequired'),
    FORM_NAME_REQUIRED: t('validation.formNameRequired'),
    FORM_NAME_TOO_LONG: (longFormNames: string[]) =>
      t('validation.formNameTooLong', {
        longFormNames: longFormNames.join(', '),
        maxLength: MAX_FORM_NAME_LENGTH,
      }),
    FORM_NAME_INVALID_CHARS: (invalidFormNames: string[]) =>
      t('validation.formNameInvalidChars', {
        invalidFormNames: invalidFormNames.join(', '),
      }),
    FILE_NAME_TOO_LONG: (longFiles: string[]) =>
      t('validation.fileNameTooLong', {
        longFiles: longFiles.join(', '),
        maxLength: MAX_FILE_NAME_LENGTH,
      }),
    FILE_NAME_INVALID_CHARS: (invalidFiles: string[]) =>
      t('validation.fileNameInvalidChars', {
        invalidFiles: invalidFiles.join(', '),
      }),
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
  }
}

export const INITIAL_VALIDATION_STATE = {
  errors: {
    formNames: {},
  } as ValidationErrors,
  touched: {
    country: false,
    language: false,
    formNames: {},
  } as TouchedFields,
}

export const resetFileErrors = (
  setErrors: (fn: (prev: ValidationErrors) => ValidationErrors) => void
) => {
  setErrors((prev) => ({ ...prev, files: undefined }))
}

export const validateField = (
  field: string,
  value: unknown,
  setErrors: (fn: (prev: ValidationErrors) => ValidationErrors) => void,
  errorMessages: ReturnType<typeof useErrorMessages>,
  index?: number
): boolean => {
  const errorMap = {
    country: !value ? errorMessages.COUNTRY_REQUIRED : '',
    language: !value ? errorMessages.LANGUAGE_REQUIRED : '',
    formName: !value ? errorMessages.FORM_NAME_REQUIRED : '',
  }

  const error = errorMap[field as keyof typeof errorMap] || ''

  if (field === 'formName' && index !== undefined) {
    setErrors((prev) => ({
      ...prev,
      formNames: { ...prev.formNames, [index]: error },
    }))
  } else {
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  return !error
}

export const validateForm = (
  country: string,
  language: string,
  formWithFiles: FormWithFiles,
  setErrors: (errors: ValidationErrors) => void,
  setTouched: (touched: TouchedFields) => void,
  errorMessages: ReturnType<typeof useErrorMessages>
): boolean => {
  const newErrors: ValidationErrors = { formNames: {} }
  let isValid = true

  if (!country) {
    newErrors.country = errorMessages.COUNTRY_REQUIRED
    isValid = false
  }

  if (!language) {
    newErrors.language = errorMessages.LANGUAGE_REQUIRED
    isValid = false
  }

  const newTouched: TouchedFields = {
    country: true,
    language: true,
    formNames: {},
  }

  formWithFiles.files.forEach((_, index) => {
    newTouched.formNames[index] = true
  })

  formWithFiles.files.forEach((formFile, index) => {
    if (!formFile.formName.trim()) {
      newErrors.formNames![index] = errorMessages.FORM_NAME_REQUIRED
      isValid = false
    }
  })

  const fileErrors = validateFiles(formWithFiles.files, errorMessages)
  if (fileErrors) {
    newErrors.files = fileErrors
    isValid = false
  }

  setErrors(newErrors)
  setTouched(newTouched)
  return isValid
}

export const isFormValid = (
  country: string,
  language: string,
  formWithFiles: FormWithFiles,
  isEdit: boolean
): boolean => {
  const hasRequiredFields = country && language

  if (!hasRequiredFields) return false

  return isEdit ? true : formWithFiles.files.length > 0
}

const getFileExtension = (fileName: string): string => {
  return fileName.toLowerCase().substring(fileName.lastIndexOf('.'))
}

export const validateFiles = (
  formFiles: FormFile[],
  errorMessages: ReturnType<typeof useErrorMessages>
): ValidationErrors['files'] => {
  const errors: ValidationErrors['files'] = {}

  const invalidFiles: string[] = []
  const exceededFiles: string[] = []
  const allFileNames: string[] = []
  const duplicateFiles: string[] = []
  const invalidFileNames: string[] = []
  const longFileNames: string[] = []
  const formNamesTooLong: string[] = []
  const formNamesInvalidChars: string[] = []

  let totalFiles = 0
  const maxSizeBytes = MAX_FILE_SIZE_MB * 1024 * 1024

  formFiles.forEach((formFile) => {
    totalFiles++

    const extension = getFileExtension(formFile.fileName)
    if (
      !ALLOWED_FILE_TYPES.includes(
        extension as (typeof ALLOWED_FILE_TYPES)[number]
      )
    ) {
      if (!invalidFiles.includes(formFile.fileName)) {
        invalidFiles.push(formFile.fileName)
      }
    }

    if (formFile.file.size > maxSizeBytes) {
      if (!exceededFiles.includes(formFile.fileName)) {
        exceededFiles.push(formFile.fileName)
      }
    }

    if (allFileNames.includes(formFile.fileName)) {
      if (!duplicateFiles.includes(formFile.fileName)) {
        duplicateFiles.push(formFile.fileName)
      }
    } else {
      allFileNames.push(formFile.fileName)
    }

    const specialCharsRegex = new RegExp(regSpecialCharacters)
    if (specialCharsRegex.test(formFile.fileName)) {
      if (!invalidFileNames.includes(formFile.fileName)) {
        invalidFileNames.push(formFile.fileName)
      }
    }

    if (formFile.fileName.length > MAX_FILE_NAME_LENGTH) {
      if (!longFileNames.includes(formFile.fileName)) {
        longFileNames.push(formFile.fileName)
      }
    } else if (formFile.formName.length > MAX_FORM_NAME_LENGTH) {
      if (!formNamesTooLong.includes(formFile.formName)) {
        formNamesTooLong.push(formFile.formName)
      }
    } else if (new RegExp(regSpecialCharacters).test(formFile.formName)) {
      if (!formNamesInvalidChars.includes(formFile.formName)) {
        formNamesInvalidChars.push(formFile.formName)
      }
    }
  })

  if (totalFiles > MAX_FILES_PER_MODULE) {
    errors.uploadLimitExceeded =
      errorMessages.UPLOAD_LIMIT_EXCEEDED(MAX_FILES_PER_MODULE)
  }

  if (invalidFiles.length > 0) {
    errors.invalidFileTypes = errorMessages.INVALID_FILE_TYPES(invalidFiles)
  }

  if (exceededFiles.length > 0) {
    errors.fileSizeExceeded = errorMessages.FILE_SIZE_EXCEEDED(exceededFiles)
  }

  if (duplicateFiles.length > 0) {
    errors.duplicateFileNames =
      errorMessages.DUPLICATE_FILE_NAMES(duplicateFiles)
  }

  if (invalidFileNames.length > 0) {
    errors.fileNameInvalidChars =
      errorMessages.FILE_NAME_INVALID_CHARS(invalidFileNames)
  }

  if (longFileNames.length > 0) {
    errors.fileNameTooLong = errorMessages.FILE_NAME_TOO_LONG(longFileNames)
  }

  if (formNamesTooLong.length > 0) {
    errors.formNameTooLong = errorMessages.FORM_NAME_TOO_LONG(formNamesTooLong)
  }

  if (formNamesInvalidChars.length > 0) {
    errors.formNameInvalidChars = errorMessages.FORM_NAME_INVALID_CHARS(
      formNamesInvalidChars
    )
  }

  return Object.keys(errors).length > 0 ? errors : undefined
}
