import {
  useFieldHandlers,
  useFileHandlers,
  useSubmitHandlers,
  type Country,
  type Language,
  type BaseFile,
} from '@/features/landing-page-cms/shared'
import { useCreateMedia, useUpdateMedia } from '../../../api/commands'
import type {
  AssetModuleWithFiles,
  AssetDetail,
  ValidationErrors,
  TouchedFields,
} from '../../../data/schema'
import { TRANSLATION_KEY } from '../../../data/schema'
import { createAssetUploadConfig } from '../../../data/schema'
import {
  validateAssetField,
  validateAssetForm,
  isAssetFormValid,
  useErrorMessages,
} from '../../../data/validation'
import { useAssetModuleHandlers } from './use-asset-module-handlers'

interface UseAssetFormHandlersProps {
  asset: AssetDetail | null | undefined
  country: string
  language: string
  fileName: string
  moduleRows: AssetModuleWithFiles[]
  touched: TouchedFields
  isEdit: boolean
  isMediaIdInUse: boolean
  countries: Country[]
  languages: Language[]
  setLanguageOptions: React.Dispatch<
    React.SetStateAction<{ value: string; label: string }[]>
  >
  setCountry: React.Dispatch<React.SetStateAction<string>>
  setLanguage: React.Dispatch<React.SetStateAction<string>>
  setFileName: React.Dispatch<React.SetStateAction<string>>
  setModuleRows: React.Dispatch<React.SetStateAction<AssetModuleWithFiles[]>>
  setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>
  setTouched: React.Dispatch<React.SetStateAction<TouchedFields>>
  setExpandedModules: React.Dispatch<
    React.SetStateAction<Record<number, boolean>>
  >
  resetForm: () => void
  resetTouchedForModules: (moduleCount: number) => void
  onOpenChange: (open: boolean) => void
  onBackendError: (error: string | null) => void
  fileConfig?: {
    maximumFiles?: number
    maxFileSize?: number
    allowedExtensions?: string[]
  }
}

export function useAssetFormHandlers(props: UseAssetFormHandlersProps) {
  const {
    asset,
    country,
    language,
    moduleRows,
    touched,
    isEdit,
    isMediaIdInUse,
    countries,
    languages,
    setLanguageOptions,
    setCountry,
    setLanguage,
    setFileName,
    setModuleRows,
    setErrors,
    setTouched,
    setExpandedModules,
    resetTouchedForModules,
    onOpenChange,
    onBackendError,
    fileConfig,
  } = props

  const errorMessages = useErrorMessages()
  const uploadConfig = createAssetUploadConfig(fileConfig)

  const validateFieldWrapper = (
    field: string,
    value: any,
    setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>,
    index?: number
  ): boolean => {
    return validateAssetField(field, value, setErrors, errorMessages, index)
  }

  const validateFormWrapper = (
    country: string,
    language: string,
    formData: AssetModuleWithFiles[],
    setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>,
    setTouched: React.Dispatch<React.SetStateAction<TouchedFields>>
  ): boolean => {
    return validateAssetForm(
      country,
      language,
      formData,
      setErrors,
      setTouched,
      errorMessages,
      uploadConfig
    )
  }

  const formHandlers = useFieldHandlers({
    country,
    language,
    formData: moduleRows,
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
    isFormValid: isAssetFormValid,
    markFieldTouched: (field: 'country' | 'language', index?: number) => {
      if (index !== undefined) {
        setTouched((prev) => ({
          ...prev,
          modules: { ...prev.modules, [index]: true },
        }))
      } else {
        setTouched((prev) => ({ ...prev, [field]: true }))
      }
    },
    getInitialLanguage: (
      languageByCountry: Language[],
      selectedCountry?: Country
    ) => {
      const firstLanguage = languageByCountry[0]
      return selectedCountry?.languageCode || firstLanguage?.languageCode || ''
    },
  })

  const moduleHandlers = useAssetModuleHandlers({
    moduleRows,
    touched,
    setModuleRows,
    setErrors,
    setTouched,
    resetTouchedForModules,
  })

  const fileHandlers = useFileHandlers({
    mode: 'modules',
    isEdit,
    fileGroups: moduleRows,
    setFileGroups: setModuleRows,
    setErrors,
    setFileName,
    setExpandedModules,
  })

  const prepareCreateRequest = (
    country: string,
    language: string,
    moduleRows: AssetModuleWithFiles[]
  ) => ({
    targetCountryCode: country,
    languageCode: language,
    moduleRows: moduleRows.map((module) => ({
      module: module.module,
      files: module.files.map(
        (file): BaseFile => ({
          file,
          fileName: file.name,
        })
      ),
    })),
  })

  const prepareUpdateRequest = (
    asset: AssetDetail,
    country: string,
    language: string,
    moduleRows: AssetModuleWithFiles[]
  ) => {
    if (!moduleRows.length || !moduleRows[0].files?.length) {
      throw new Error(errorMessages.MODULE_REQUIRED)
    }

    const mediaId = asset.mediaId
    const inputFileName = moduleRows[0].files?.[0]?.name || asset.mediaName
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

  const hasRestrictedFieldsChanged = (
    mediaDetail: AssetDetail,
    country: string,
    language: string,
    formData: AssetModuleWithFiles[]
  ) => {
    if (!formData.length || !formData[0]?.files?.length) {
      return false
    }

    const hasChangedCountry = country !== mediaDetail.targetCountryCode
    const hasChangedLanguage = language !== mediaDetail.marketId
    const hasChangedModule =
      formData[0].module !== mediaDetail.moduleId.toString()

    return hasChangedCountry || hasChangedLanguage || hasChangedModule
  }

  const shouldShowOverwriteConfirm = (
    mediaDetail: AssetDetail,
    formData: AssetModuleWithFiles[]
  ) => {
    if (!formData.length || !formData[0].files?.length) {
      return false
    }
    return formData[0].files[0].name === mediaDetail.mediaName
  }

  const submitHandlers = useSubmitHandlers<AssetModuleWithFiles[], AssetDetail>(
    {
      mediaDetail: asset,
      country,
      language,
      formData: moduleRows,
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
    }
  )

  const handleSubmit = async () => {
    await submitHandlers.handleSubmit(formHandlers.validateForm)
  }

  const handleCancel = () => {
    props.resetForm()
    submitHandlers.handleCancel()
  }

  return {
    ...formHandlers,
    ...moduleHandlers,
    ...fileHandlers,
    handleSubmit,
    handleCancel,
    showConfirmOverwrite: submitHandlers.showConfirmOverwrite,
    handleConfirmOverwrite: submitHandlers.handleConfirmOverwrite,
    handleCancelOverwrite: submitHandlers.handleCancelOverwrite,
    isPending: submitHandlers.isPending,
  }
}
