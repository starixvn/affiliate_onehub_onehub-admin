import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { MediaDetail } from '../schema'

interface UseSubmitHandlersProps<TData, TDetail extends MediaDetail> {
  mediaDetail?: TDetail | null
  country: string
  language: string
  formData: TData
  isEdit: boolean
  isMediaIdInUse: boolean

  useCreateMutation: (onError: (error: string) => void) => {
    mutateAsync: (data: any) => Promise<{ errorCode: number }>
    isPending: boolean
  }
  useUpdateMutation: (onError: (error: string) => void) => {
    mutateAsync: (data: { data: any }) => Promise<{ errorCode: number }>
    isPending: boolean
  }

  prepareCreateRequest: (
    country: string,
    language: string,
    formData: TData
  ) => any
  prepareUpdateRequest: (
    mediaDetail: TDetail,
    country: string,
    language: string,
    formData: TData
  ) => any
  hasRestrictedFieldsChanged: (
    mediaDetail: TDetail,
    country: string,
    language: string,
    formData: TData
  ) => boolean
  shouldShowOverwriteConfirm: (mediaDetail: TDetail, formData: TData) => boolean

  setErrors: React.Dispatch<React.SetStateAction<any>>
  onOpenChange: (open: boolean) => void
  onBackendError: (error: string) => void

  translationKey: string
}

export function useSubmitHandlers<TData, TDetail extends MediaDetail>({
  mediaDetail,
  country,
  language,
  formData,
  isEdit,
  isMediaIdInUse,
  useCreateMutation,
  useUpdateMutation,
  prepareCreateRequest,
  prepareUpdateRequest,
  hasRestrictedFieldsChanged,
  shouldShowOverwriteConfirm,
  setErrors,
  onOpenChange,
  onBackendError,
  translationKey,
}: UseSubmitHandlersProps<TData, TDetail>) {
  const createMutation = useCreateMutation(onBackendError)
  const updateMutation = useUpdateMutation(onBackendError)
  const { t } = useTranslation(translationKey)
  const [showConfirmOverwrite, setShowConfirmOverwrite] = useState(false)

  const setMediaInUseError = (error: string | undefined) => {
    setErrors((prev: any) => ({
      ...prev,
      mediaInUse: error,
    }))
  }

  const handleSubmit = async (validateForm: () => boolean) => {
    if (!validateForm()) {
      return
    }

    if (
      isEdit &&
      mediaDetail &&
      isMediaIdInUse &&
      hasRestrictedFieldsChanged(mediaDetail, country, language, formData)
    ) {
      setMediaInUseError(t('validation.mediaInUse'))
      return
    }

    if (isEdit && isMediaIdInUse) {
      setMediaInUseError(undefined)
    }

    if (
      isEdit &&
      mediaDetail &&
      shouldShowOverwriteConfirm(mediaDetail, formData)
    ) {
      setShowConfirmOverwrite(true)
      return
    }

    await performSubmit()
  }

  const performSubmit = async () => {
    if (isEdit && mediaDetail) {
      const request = prepareUpdateRequest(
        mediaDetail,
        country,
        language,
        formData
      )
      const response = await updateMutation.mutateAsync({ data: request })
      if (response.errorCode === 0) {
        handleCancel()
      }
    } else {
      const request = prepareCreateRequest(country, language, formData)
      const response = await createMutation.mutateAsync(request)
      if (response.errorCode === 0) {
        handleCancel()
      }
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
    isPending: createMutation.isPending || updateMutation.isPending,
  }
}
