import type { UseMutationResult } from '@tanstack/react-query'
import type {
  RegisterFormDetail,
  FormWithFiles,
  ValidationErrors,
  TouchedFields,
} from '../../../data/schema'
import type { Country, Language } from '../../../types'
import type {
  CreateRegisterFormResponse,
  UpdateRegisterFormResponse,
} from '../../../types'
import { useRegisterFormFieldHandlers } from './use-registration-form-field-handlers'
import { useRegisterFormFileHandlers } from './use-registration-form-file-handlers'
import { useRegisterFormSubmitHandlers } from './use-registration-form-submit-handlers'

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
  setTouched: React.Dispatch<
    React.SetStateAction<{
      country: boolean
      language: boolean
      formNames: { [key: number]: boolean }
    }>
  >
  resetTouchedForFormNames: (fileCount: number) => void
  onOpenChange: (open: boolean) => void
  createRegisterFormMutation: UseMutationResult<
    CreateRegisterFormResponse,
    Error,
    unknown
  >
  updateRegisterFormMutation: UseMutationResult<
    UpdateRegisterFormResponse,
    Error,
    unknown
  >
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
  createRegisterFormMutation,
  updateRegisterFormMutation,
}: UseRegisterFormFormHandlersProps) {
  const fieldHandlers = useRegisterFormFieldHandlers({
    country,
    language,
    formWithFiles,
    touched,
    isEdit,
    countries,
    languages,
    setLanguageOptions,
    setCountry,
    setLanguage,
    setErrors,
    setTouched,
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

  const submitHandlers = useRegisterFormSubmitHandlers({
    registerForm,
    country,
    language,
    formWithFiles,
    isEdit,
    isMediaIdInUse,
    setErrors,
    onOpenChange,
    createRegisterFormMutation,
    updateRegisterFormMutation,
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
  }
}
