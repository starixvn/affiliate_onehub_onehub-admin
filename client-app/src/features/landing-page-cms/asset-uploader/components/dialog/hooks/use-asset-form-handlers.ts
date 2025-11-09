import type {
  ModuleWithFiles,
  ValidationErrors,
  TouchedFields,
  AssetDetail,
} from '../../../data/schema'
import type { Language } from '../../../types'
import { useAssetFieldHandlers } from './use-asset-field-handlers'
import { useAssetFileHandlers } from './use-asset-file-handlers'
import { useAssetModuleHandlers } from './use-asset-module-handlers'
import { useAssetSubmitHandlers } from './use-asset-submit-handlers'

interface UseAssetFormHandlersProps {
  asset: AssetDetail | null | undefined
  country: string
  language: string
  fileName: string
  moduleRows: ModuleWithFiles[]
  touched: TouchedFields
  isEdit: boolean
  isMediaIdInUse: boolean
  languages: Language[]
  setLanguageOptions: React.Dispatch<
    React.SetStateAction<{ value: string; label: string }[]>
  >
  setCountry: React.Dispatch<React.SetStateAction<string>>
  setLanguage: React.Dispatch<React.SetStateAction<string>>
  setFileName: React.Dispatch<React.SetStateAction<string>>
  setModuleRows: React.Dispatch<React.SetStateAction<ModuleWithFiles[]>>
  setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>
  setTouched: React.Dispatch<React.SetStateAction<TouchedFields>>
  setExpandedModules: React.Dispatch<
    React.SetStateAction<Record<number, boolean>>
  >
  resetForm: () => void
  resetTouchedForModules: (moduleCount: number) => void
  onOpenChange: (open: boolean) => void
  createAssetMutation: any
  updateAssetMutation: any
}

export function useAssetFormHandlers(props: UseAssetFormHandlersProps) {
  const {
    asset,
    country,
    language,
    fileName,
    moduleRows,
    touched,
    isEdit,
    isMediaIdInUse,
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
    createAssetMutation,
    updateAssetMutation,
  } = props

  const formHandlers = useAssetFieldHandlers({
    country,
    language,
    fileName,
    moduleRows,
    isEdit,
    languages,
    setLanguageOptions,
    setCountry,
    setLanguage,
    setErrors,
    setTouched,
  })

  const moduleHandlers = useAssetModuleHandlers({
    moduleRows,
    touched,
    setModuleRows,
    setErrors,
    setTouched,
    resetTouchedForModules,
  })

  const fileHandlers = useAssetFileHandlers({
    moduleRows,
    isEdit,
    setModuleRows,
    setFileName,
    setErrors,
    setExpandedModules,
  })

  const submitHandlers = useAssetSubmitHandlers({
    asset: asset as AssetDetail,
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
  })

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
  }
}
