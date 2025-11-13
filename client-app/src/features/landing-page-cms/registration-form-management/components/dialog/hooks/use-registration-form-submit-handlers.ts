import { useState } from 'react'
import type { UseMutationResult } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { REGISTER_FORM_MODULE_ID } from '../../../data/constants'
import type {
  RegisterFormDetail,
  FormWithFiles,
  ValidationErrors,
} from '../../../data/schema'
import type {
  CreateRegisterFormResponse,
  UpdateRegisterFormResponse,
} from '../../../types'

interface UseRegisterFormSubmitHandlersProps {
  registerForm?: RegisterFormDetail | null
  country: string
  language: string
  formWithFiles: FormWithFiles
  isEdit: boolean
  isMediaIdInUse: boolean
  setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>
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

export function useRegisterFormSubmitHandlers({
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
}: UseRegisterFormSubmitHandlersProps) {
  const { t } = useTranslation('registration-form-management')
  const [showConfirmOverwrite, setShowConfirmOverwrite] = useState(false)

  const hasRestrictedFieldsChanged = () => {
    if (!registerForm) return false
    const hasChangedCountry = country !== registerForm?.targetCountryCode
    const hasChangedLanguage = language !== registerForm?.marketId

    return hasChangedCountry || hasChangedLanguage
  }

  const setMediaInUseError = (error: string | undefined) => {
    setErrors((prev) => ({
      ...prev,
      mediaInUse: error,
    }))
  }

  const prepareCreateRequest = () => {
    return {
      targetCountryCode: country,
      languageCode: language,
      moduleRows: [formWithFiles],
    }
  }

  const prepareUpdateRequest = () => {
    const inputMediaName = formWithFiles.files[0].formName || ''
    const file = formWithFiles.files[0].file
    const inputFileName = file.name
      ? file.name
      : registerForm?.fileName.split('/').pop() || ''

    return {
      mediaId: registerForm?.mediaId,
      moduleId: REGISTER_FORM_MODULE_ID,
      targetCountryCode: country,
      languageCode: language,
      inputFileName,
      inputMediaName,
      file,
    }
  }

  const handleSubmit = async (validateFormFn: () => boolean) => {
    if (!validateFormFn()) {
      return
    }

    if (isEdit && isMediaIdInUse && hasRestrictedFieldsChanged()) {
      setMediaInUseError(t('validation.mediaInUse'))
      return
    }

    if (isEdit && isMediaIdInUse) {
      setMediaInUseError(undefined)
    }

    if (
      isEdit &&
      formWithFiles.files.length > 0 &&
      formWithFiles.files[0].file.name &&
      formWithFiles.files[0].file.name ===
        registerForm?.fileName.split('/').pop()
    ) {
      setShowConfirmOverwrite(true)
      return
    }

    await performSubmit()
  }

  const performSubmit = async () => {
    const request = isEdit ? prepareUpdateRequest() : prepareCreateRequest()
    const mutation = isEdit
      ? updateRegisterFormMutation
      : createRegisterFormMutation
    const payload = isEdit ? { data: request } : request

    const response = await mutation.mutateAsync(payload)

    if (response.errorCode === 0) {
      handleCancel()
    }
  }

  const handleConfirmOverwrite = async () => {
    setShowConfirmOverwrite(false)
    await performSubmit()
  }

  const handleCancelOverwrite = () => {
    setShowConfirmOverwrite(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return {
    handleSubmit,
    handleCancel,
    showConfirmOverwrite,
    handleConfirmOverwrite,
    handleCancelOverwrite,
  }
}
