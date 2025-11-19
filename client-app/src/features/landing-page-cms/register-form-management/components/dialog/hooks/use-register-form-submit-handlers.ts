import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type {
  RegisterFormDetail,
  FormWithFiles,
  ValidationErrors,
} from '../../../data/schema'
import { REGISTER_FORM_MODULE_ID } from '../../../data/constants'

interface UseRegisterFormSubmitHandlersProps {
  registerForm?: RegisterFormDetail | null
  country: string
  language: string
  formWithFiles: FormWithFiles
  isEdit: boolean
  isMediaIdInUse: boolean
  setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>
  onOpenChange: (open: boolean) => void
  createRegisterFormMutation: any
  updateRegisterFormMutation: any
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
  const { t } = useTranslation('register-form-management')
  const [showConfirmOverwrite, setShowConfirmOverwrite] = useState(false)

  const hasRestrictedFieldsChanged = () => {
    if (!registerForm) return false
    const hasChangedCountry = country !== registerForm?.targetCountryCode
    const hasChangedLanguage = language !== registerForm?.marketId

    return hasChangedCountry || hasChangedLanguage
  }

  const prepareCreateRequest = () => {
    return {
      targetCountryCode: country,
      languageCode: language,
      moduleRows: [formWithFiles],
    }
  }

  const prepareUpdateRequest = () => {
    const inputFileName = registerForm?.fileName.split('/').pop() || ''
    const inputMediaName = formWithFiles.files[0].formName || ''
    const file = formWithFiles.files[0].file

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
      setErrors((prev) => ({
        ...prev,
        mediaInUse: t('validation.mediaInUse'),
      }))
      return
    }

    if (isEdit && isMediaIdInUse) {
      setErrors((prev) => ({
        ...prev,
        mediaInUse: undefined,
      }))
    }

    if (
      isEdit &&
      formWithFiles.files.length > 0 &&
      formWithFiles.files[0].file.name === registerForm?.mediaName
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
