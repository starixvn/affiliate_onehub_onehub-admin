import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type AssetDetail } from '../../../data/schema'

interface UseAssetSubmitHandlersProps {
  asset: AssetDetail | null | undefined
  country: string
  language: string
  fileName: string
  moduleRows: Array<{ module: string; files: File[] }>
  isEdit: boolean
  isMediaIdInUse: boolean
  setErrors: React.Dispatch<React.SetStateAction<any>>
  onOpenChange: (open: boolean) => void
  createAssetMutation: any
  updateAssetMutation: any
}

export function useAssetSubmitHandlers({
  asset,
  country,
  language,
  fileName,
  moduleRows,
  isEdit,
  isMediaIdInUse,
  setErrors,
  onOpenChange,
  createAssetMutation,
  updateAssetMutation,
}: UseAssetSubmitHandlersProps) {
  const { t } = useTranslation('asset-uploader')
  const [showConfirmOverwrite, setShowConfirmOverwrite] = useState(false)

  const prepareCreateRequest = () => {
    return {
      targetCountryCode: country,
      languageCode: language,
      moduleRows: moduleRows,
    }
  }

  const prepareUpdateRequest = () => {
    const mediaId = asset?.mediaId
    const inputFileName = moduleRows[0].files?.[0]?.name || asset?.mediaName
    const moduleId = Number(moduleRows[0].module)
    const file = moduleRows[0].files[0]

    return {
      mediaId,
      moduleId,
      targetCountryCode: country,
      languageCode: language,
      inputFileName,
      file,
    }
  }

  const hasRestrictedFieldsChanged = () => {
    const hasChangedCountry = country !== asset?.targetCountryCode
    const hasChangedLanguage = language !== asset?.marketId
    const hasChangedModule =
      moduleRows[0]?.module !== asset?.moduleId.toString()

    return hasChangedCountry || hasChangedLanguage || hasChangedModule
  }

  const handleSubmit = async (validateForm: () => boolean) => {
    if (!validateForm()) {
      return
    }

    if (isEdit && isMediaIdInUse && hasRestrictedFieldsChanged()) {
      setErrors((prev: any) => ({
        ...prev,
        mediaInUse: t('validation.mediaInUse'),
      }))
      return
    }

    if (isEdit && isMediaIdInUse) {
      setErrors((prev: any) => ({
        ...prev,
        mediaInUse: undefined,
      }))
    }

    if (isEdit && fileName === asset?.mediaName) {
      setShowConfirmOverwrite(true)
      return
    }

    await performSubmit()
  }

  const performSubmit = async () => {
    const request = isEdit ? prepareUpdateRequest() : prepareCreateRequest()
    const mutation = isEdit ? updateAssetMutation : createAssetMutation
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
    handleCancelOverwrite
  }
}
