interface UseAssetSubmitHandlersProps {
  country: string
  language: string
  moduleRows: Array<{ module: string; files: File[] }>
  isEdit: boolean
  onOpenChange: (open: boolean) => void
  createAssetMutation: any
  updateAssetMutation: any
}

export function useAssetSubmitHandlers({
  country,
  language,
  moduleRows,
  isEdit,
  onOpenChange,
  createAssetMutation,
  updateAssetMutation,
}: UseAssetSubmitHandlersProps) {
  const prepareCreateRequest = () => {
    return {
      targetCountryCode: country,
      languageCode: language,
      moduleRows: moduleRows,
    }
  }

  const prepareUpdateRequest = () => {
    const moduleId = Number(moduleRows[0].module)
    const files = moduleRows[0].files

    return {
      moduleId,
      targetCountryCode: country,
      languageCode: language,
      files,
    }
  }

  const handleSubmit = async (validateForm: () => boolean) => {
    if (!validateForm()) {
      return
    }

    if (isEdit) {
      const request = prepareUpdateRequest()
      const response = await updateAssetMutation.mutateAsync({
        data: request,
      })

      if (response.errorCode === 0) {
        handleCancel()
      }
    } else {
      const request = prepareCreateRequest()
      const response = await createAssetMutation.mutateAsync(request)

      if (response.errorCode === 0) {
        handleCancel()
      }
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return {
    handleSubmit,
    handleCancel,
  }
}
