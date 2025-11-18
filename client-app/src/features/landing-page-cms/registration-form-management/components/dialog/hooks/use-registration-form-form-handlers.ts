import {
  useFieldHandlers,
  useSubmitHandlers,
  type Country,
  type Language,
} from '@/features/landing-page-cms/shared'
import { useCreateMedia, useUpdateMedia } from '../../../api/commands'
import type {
  RegisterFormDetail,
  FormWithFiles,
  ValidationErrors,
  TouchedFields,
} from '../../../data/schema'
import {
  REGISTER_FORM_MODULE_ID,
  TRANSLATION_KEY,
  createRegistrationFormUploadConfig,
} from '../../../data/schema'
import {
  validateRegistrationFormField,
  validateRegistrationForm,
  isRegistrationFormValid,
  resetFileErrors,
  useErrorMessages,
} from '../../../data/validation'
import { useRegisterFormFileHandlers } from './use-registration-form-file-handlers'

interface UseRegisterFormFormHandlersProps {
  registerForm?: RegisterFormDetail | null
  country: string
  language: string
  formWithFiles: FormWithFiles
  touched: TouchedFields
  isEdit: boolean
  isMediaIdInUse: boolean
  countries: Country[]
  languages: Language[]
  setLanguageOptions: React.Dispatch<
    React.SetStateAction<Array<{ value: string; label: string }>>
  >
  setCountry: React.Dispatch<React.SetStateAction<string>>
  setLanguage: React.Dispatch<React.SetStateAction<string>>
  setFormWithFiles: React.Dispatch<React.SetStateAction<FormWithFiles>>
  setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>
  setTouched: React.Dispatch<React.SetStateAction<TouchedFields>>
  resetTouchedForFormNames: (fileCount: number) => void
  onOpenChange: (open: boolean) => void
  onBackendError: (error: string | null) => void
  fileConfig?: {
    maximumFiles?: number
    maxFileSize?: number
    allowedExtensions?: string[]
  }
}

export function useRegisterFormFormHandlers({
  registerForm,
  country,
  language,
  formWithFiles,
  touched,
  isEdit,
  isMediaIdInUse,
  countries,
  languages,
  setLanguageOptions,
  setCountry,
  setLanguage,
  setFormWithFiles,
  setErrors,
  setTouched,
  resetTouchedForFormNames,
  onOpenChange,
  onBackendError,
  fileConfig,
}: UseRegisterFormFormHandlersProps) {
  const errorMessages = useErrorMessages()
  const uploadConfig = createRegistrationFormUploadConfig(fileConfig)

  const validateFieldWrapper = (
    field: string,
    value: any,
    setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>,
    index?: number
  ) => {
    validateRegistrationFormField(field, value, setErrors, errorMessages, index)
  }

  const validateFormWrapper = (
    country: string,
    language: string,
    formData: FormWithFiles,
    setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>,
    setTouched: React.Dispatch<React.SetStateAction<TouchedFields>>
  ): boolean => {
    return validateRegistrationForm(
      country,
      language,
      formData,
      setErrors,
      setTouched,
      errorMessages,
      uploadConfig
    )
  }
  const fieldHandlers = useFieldHandlers({
    country,
    language,
    formData: formWithFiles,
    isEdit,
    countries,
    languages,
    setLanguageOptions,
    setCountry,
    setLanguage,
    setErrors,
    setTouched,
    validateField: validateFieldWrapper,
    validateForm: validateFormWrapper,
    isFormValid: isRegistrationFormValid,
    resetFileErrors,
    getInitialLanguage: (languageByCountry: Language[]) =>
      languageByCountry[0].languageCode,
  })

  const fileHandlers = useRegisterFormFileHandlers({
    isEdit,
    formWithFiles,
    touched,
    setFormWithFiles,
    setErrors,
    setTouched,
    resetTouchedForFormNames,
  })

  const prepareCreateRequest = (
    country: string,
    language: string,
    formWithFiles: FormWithFiles
  ) => ({
    targetCountryCode: country,
    languageCode: language,
    moduleRows: [formWithFiles],
  })

  const prepareUpdateRequest = (
    registerForm: RegisterFormDetail,
    country: string,
    language: string,
    formWithFiles: FormWithFiles
  ) => {
    if (
      !Array.isArray(formWithFiles.files) ||
      formWithFiles.files.length === 0
    ) {
      throw new Error('Form must contain at least one file')
    }

    const firstFile = formWithFiles.files[0]
    const inputMediaName = firstFile?.formName ?? ''
    const file = firstFile?.file
    const inputFileName =
      file?.name || registerForm.fileName.split('/').pop() || ''

    return {
      mediaId: registerForm.mediaId,
      moduleId: REGISTER_FORM_MODULE_ID,
      targetCountryCode: country,
      languageCode: language,
      inputFileName,
      inputMediaName,
      file,
    }
  }

  const hasRestrictedFieldsChanged = (
    mediaDetail: RegisterFormDetail,
    country: string,
    language: string,
    _formData: FormWithFiles
  ) => {
    const hasChangedCountry = country !== mediaDetail.targetCountryCode
    const hasChangedLanguage = language !== mediaDetail.marketId

    return hasChangedCountry || hasChangedLanguage
  }

  const shouldShowOverwriteConfirm = (
    mediaDetail: RegisterFormDetail,
    formData: FormWithFiles
  ): boolean => {
    if (!Array.isArray(formData.files) || formData.files.length === 0) {
      return false
    }

    const firstFile = formData.files[0]
    if (!firstFile?.file?.name) {
      return false
    }

    return firstFile.file.name === (mediaDetail.fileName.split('/').pop() || '')
  }

  const submitHandlers = useSubmitHandlers<FormWithFiles, RegisterFormDetail>({
    mediaDetail: registerForm,
    country,
    language,
    formData: formWithFiles,
    isEdit,
    isMediaIdInUse,
    useCreateMutation: useCreateMedia,
    useUpdateMutation: useUpdateMedia,
    prepareCreateRequest,
    prepareUpdateRequest,
    hasRestrictedFieldsChanged,
    shouldShowOverwriteConfirm,
    setErrors,
    onOpenChange,
    onBackendError,
    translationKey: TRANSLATION_KEY,
  })

  const handleSubmit = async () => {
    await submitHandlers.handleSubmit(fieldHandlers.validateForm)
  }

  const handleCancel = () => {
    submitHandlers.handleCancel()
  }

  return {
    ...fieldHandlers,
    ...fileHandlers,
    handleSubmit,
    handleCancel,
    showConfirmOverwrite: submitHandlers.showConfirmOverwrite,
    handleConfirmOverwrite: submitHandlers.handleConfirmOverwrite,
    handleCancelOverwrite: submitHandlers.handleCancelOverwrite,
    isPending: submitHandlers.isPending,
  }
}
