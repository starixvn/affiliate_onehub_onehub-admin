import { useTranslation } from 'react-i18next'
import type {
  ValidationErrors,
  TouchedFields,
  FileItem,
  ModuleWithFiles,
  FormWithFiles,
  FileUploadConfig,
  ValidationMode,
} from './types'
import { DEFAULT_FILE_UPLOAD_CONFIG } from './types'

export interface ErrorMessages {
  COUNTRY_REQUIRED: string
  LANGUAGE_REQUIRED: string
  MODULE_REQUIRED: string
  FORM_NAME_REQUIRED: string
  MODULES_WITHOUT_FILES: (emptyModuleIndexes: number[]) => string
  FORM_NAME_TOO_LONG: (longFormNames: string[]) => string
  FORM_NAME_INVALID_CHARS: (invalidFormNames: string[]) => string
  FILE_NAME_TOO_LONG: (longFiles: string[]) => string
  FILE_NAME_INVALID_CHARS: (invalidFiles: string[]) => string
  UPLOAD_LIMIT_EXCEEDED: (maxFiles: number) => string
  INVALID_FILE_TYPES: (invalidFiles: string[]) => string
  FILE_SIZE_EXCEEDED: (exceededFiles: string[]) => string
  DUPLICATE_FILE_NAMES: (duplicateFiles: string[]) => string
}

export const createErrorMessages = (
  translationKey: string
): (() => ErrorMessages) => {
  return () => {
    const { t } = useTranslation(translationKey)

    return {
      COUNTRY_REQUIRED: t('validation.countryRequired'),
      LANGUAGE_REQUIRED: t('validation.languageRequired'),
      MODULE_REQUIRED: t('validation.moduleRequired'),
      FORM_NAME_REQUIRED: t('validation.formNameRequired'),
      MODULES_WITHOUT_FILES: (emptyModuleIndexes: number[]) =>
        t('validation.modulesWithoutFiles', {
          moduleIndexes: emptyModuleIndexes.map((i) => i + 1).join(', '),
        }),
      FORM_NAME_TOO_LONG: (longFormNames: string[]) =>
        t('validation.formNameTooLong', {
          longFormNames: longFormNames.join(', '),
          maxLength: DEFAULT_FILE_UPLOAD_CONFIG.maxFormNameLength,
        }),
      FORM_NAME_INVALID_CHARS: (invalidFormNames: string[]) =>
        t('validation.formNameInvalidChars', {
          invalidFormNames: invalidFormNames.join(', '),
        }),
      FILE_NAME_TOO_LONG: (longFiles: string[]) =>
        t('validation.fileNameTooLong', {
          longFiles: longFiles.join(', '),
          maxLength: DEFAULT_FILE_UPLOAD_CONFIG.maxFileNameLength,
        }),
      FILE_NAME_INVALID_CHARS: (invalidFiles: string[]) =>
        t('validation.invalidFileNames', {
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
          maxSize: DEFAULT_FILE_UPLOAD_CONFIG.maxFileSizeMB,
          exceededFiles: exceededFiles.join(', '),
        }),
      DUPLICATE_FILE_NAMES: (duplicateFiles: string[]) =>
        t('validation.duplicateFileNames', {
          duplicateFiles: duplicateFiles.join(', '),
        }),
    }
  }
}

export const createInitialValidationState = (
  mode: ValidationMode
): { errors: ValidationErrors; touched: TouchedFields } => {
  const baseErrors: ValidationErrors = {}
  const baseTouched: TouchedFields = {
    country: false,
    language: false,
  }

  if (mode === 'modules') {
    baseErrors.modules = {}
    baseTouched.modules = {}
  } else if (mode === 'formNames') {
    baseErrors.formNames = {}
    baseTouched.formNames = {}
  }

  return {
    errors: baseErrors as ValidationErrors,
    touched: baseTouched as TouchedFields,
  }
}

export const resetFileErrors = (
  setErrors: (fn: (prev: ValidationErrors) => ValidationErrors) => void
) => {
  setErrors((prev) => ({ ...prev, files: undefined }))
}

export const validateField = (
  field: string,
  value: string,
  setErrors: (fn: (prev: ValidationErrors) => ValidationErrors) => void,
  errorMessages: ErrorMessages,
  mode: ValidationMode,
  index?: number
): boolean => {
  const errorMap = {
    country: !value ? errorMessages.COUNTRY_REQUIRED : '',
    language: !value ? errorMessages.LANGUAGE_REQUIRED : '',
    module: !value ? errorMessages.MODULE_REQUIRED : '',
    formName: !value ? errorMessages.FORM_NAME_REQUIRED : '',
  }

  const error = errorMap[field as keyof typeof errorMap] || ''

  if ((field === 'module' || field === 'formName') && index !== undefined) {
    const fieldKey = mode === 'modules' ? 'modules' : 'formNames'
    setErrors((prev) => ({
      ...prev,
      [fieldKey]: { ...prev[fieldKey], [index]: error },
    }))
  } else {
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  return !error
}

export const validateForm = <T extends FileItem>(
  country: string,
  language: string,
  fileGroups: ModuleWithFiles<T>[] | FormWithFiles<T>,
  setErrors: (errors: ValidationErrors) => void,
  setTouched: (touched: TouchedFields) => void,
  errorMessages: ErrorMessages,
  config: FileUploadConfig,
  mode: ValidationMode
): boolean => {
  const newErrors: ValidationErrors = {}
  let isValid = true

  if (mode === 'modules') {
    newErrors.modules = {}
  } else {
    newErrors.formNames = {}
  }

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
  }

  if (mode === 'modules') {
    newTouched.modules = {}
    const moduleGroups = fileGroups as ModuleWithFiles<T>[]

    moduleGroups.forEach((group, index) => {
      newTouched.modules![index] = true
      if (!group.module) {
        newErrors.modules![index] = errorMessages.MODULE_REQUIRED
        isValid = false
      }
    })

    const emptyModuleIndexes: number[] = []
    moduleGroups.forEach((group, index) => {
      if (group.files.length === 0) {
        emptyModuleIndexes.push(index)
      }
    })

    if (emptyModuleIndexes.length > 0) {
      newErrors.modulesWithoutFiles =
        errorMessages.MODULES_WITHOUT_FILES(emptyModuleIndexes)
      isValid = false
    }

    const fileErrors = validateFiles(
      moduleGroups.flatMap((g) => g.files),
      errorMessages,
      config,
      mode
    )
    if (fileErrors) {
      newErrors.files = fileErrors
      isValid = false
    }
  } else {
    newTouched.formNames = {}
    const formGroup = fileGroups as FormWithFiles<T>

    formGroup.files.forEach((_, index) => {
      newTouched.formNames![index] = true
    })

    formGroup.files.forEach((fileItem, index) => {
      if ('formName' in fileItem && !fileItem.formName.trim()) {
        newErrors.formNames![index] = errorMessages.FORM_NAME_REQUIRED
        isValid = false
      }
    })

    const fileErrors = validateFiles(
      formGroup.files,
      errorMessages,
      config,
      mode
    )
    if (fileErrors) {
      newErrors.files = fileErrors
      isValid = false
    }
  }

  setErrors(newErrors)
  setTouched(newTouched)
  return isValid
}

export const isFormValid = <T extends FileItem>(
  country: string,
  language: string,
  fileGroups: ModuleWithFiles<T>[] | FormWithFiles<T>,
  isEdit: boolean,
  mode: ValidationMode
): boolean => {
  const hasRequiredFields = country && language

  if (!hasRequiredFields) return false

  if (mode === 'modules') {
    const moduleGroups = fileGroups as ModuleWithFiles<T>[]
    return isEdit
      ? true
      : moduleGroups.some((group) => group.files.length > 0 && group.module)
  } else {
    const formGroup = fileGroups as FormWithFiles<T>
    return isEdit ? true : formGroup.files.length > 0
  }
}

const getFileFromItem = (fileItem: FileItem): File => {
  if (fileItem instanceof File) {
    return fileItem
  }
  return fileItem.file
}

const getFileNameFromItem = (fileItem: FileItem): string => {
  if (fileItem instanceof File) {
    return fileItem.name
  }
  return fileItem.fileName
}

const getFileExtension = (fileName: string): string => {
  return fileName.toLowerCase().substring(fileName.lastIndexOf('.'))
}

export const validateFiles = <T extends FileItem>(
  files: T[],
  errorMessages: ErrorMessages,
  config: FileUploadConfig,
  mode: ValidationMode
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
  const maxSizeBytes = config.maxFileSizeMB * 1024 * 1024

  files.forEach((fileItem) => {
    totalFiles++

    const file = getFileFromItem(fileItem)
    const fileName = getFileNameFromItem(fileItem)

    const extension = getFileExtension(fileName)
    if (!config.allowedFileTypes.includes(extension)) {
      if (!invalidFiles.includes(fileName)) {
        invalidFiles.push(fileName)
      }
    }

    if (file.size > maxSizeBytes) {
      if (!exceededFiles.includes(fileName)) {
        exceededFiles.push(fileName)
      }
    }

    if (allFileNames.includes(fileName)) {
      if (!duplicateFiles.includes(fileName)) {
        duplicateFiles.push(fileName)
      }
    } else {
      allFileNames.push(fileName)
    }

    const specialCharsRegex = new RegExp(config.regSpecialCharacters)
    if (specialCharsRegex.test(fileName)) {
      if (!invalidFileNames.includes(fileName)) {
        invalidFileNames.push(fileName)
      }
    }

    if (fileName.length > config.maxFileNameLength) {
      if (!longFileNames.includes(fileName)) {
        longFileNames.push(fileName)
      }
    }

    if ('formName' in fileItem && mode === 'formNames') {
      const formName = fileItem.formName
      const maxFormNameLength = config.maxFormNameLength || 200

      if (formName.length > maxFormNameLength) {
        if (!formNamesTooLong.includes(formName)) {
          formNamesTooLong.push(formName)
        }
      } else if (specialCharsRegex.test(formName)) {
        if (!formNamesInvalidChars.includes(formName)) {
          formNamesInvalidChars.push(formName)
        }
      }
    }
  })

  if (totalFiles > config.maxFilesPerModule) {
    errors.uploadLimitExceeded = errorMessages.UPLOAD_LIMIT_EXCEEDED(
      config.maxFilesPerModule
    )
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
