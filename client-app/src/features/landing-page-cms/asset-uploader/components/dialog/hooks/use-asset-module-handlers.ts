import type {
  ModuleWithFiles,
  ValidationErrors,
  TouchedFields,
} from '../../../data/schema'
import {
  validateField as validateFieldHelper,
  useErrorMessages,
} from '../../../data/validation'

interface UseAssetModuleHandlersProps {
  moduleRows: ModuleWithFiles[]
  touched: TouchedFields
  setModuleRows: React.Dispatch<React.SetStateAction<ModuleWithFiles[]>>
  setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>
  setTouched: React.Dispatch<React.SetStateAction<TouchedFields>>
  resetTouchedForModules: (moduleCount: number) => void
}

export function useAssetModuleHandlers({
  moduleRows,
  touched,
  setModuleRows,
  setErrors,
  setTouched,
  resetTouchedForModules,
}: UseAssetModuleHandlersProps) {
  const errorMessages = useErrorMessages()

  const isModuleSelectedByOther = (
    moduleValue: string,
    currentModuleIndex: number
  ) => {
    return moduleRows.some(
      (row, index) => index !== currentModuleIndex && row.module === moduleValue
    )
  }

  const handleModuleChange = (moduleIndex: number, module: string) => {
    setModuleRows((prev) =>
      prev.map((row, i) => (i === moduleIndex ? { ...row, module } : row))
    )
    if (touched.modules[moduleIndex]) {
      validateFieldHelper(
        'module',
        module,
        (fn) => setErrors(fn),
        errorMessages,
        moduleIndex
      )
    }
  }

  const handleModuleBlur = (moduleIndex: number) => {
    setTouched((prev) => ({
      ...prev,
      modules: { ...prev.modules, [moduleIndex]: true },
    }))
    validateFieldHelper(
      'module',
      moduleRows[moduleIndex].module,
      (fn) => setErrors(fn),
      errorMessages,
      moduleIndex
    )
  }

  const handleAddModule = (moduleIndex: number) => {
    setModuleRows((prev) => {
      const newRows = [...prev]
      newRows.splice(moduleIndex + 1, 0, { module: '', files: [] })
      return newRows
    })
    resetTouchedForModules(moduleRows.length + 1)
  }

  const handleRemoveModule = (moduleIndex: number) => {
    if (moduleRows.length > 1) {
      setModuleRows((prev) => prev.filter((_, i) => i !== moduleIndex))
      resetTouchedForModules(moduleRows.length - 1)
    }
  }

  return {
    isModuleSelectedByOther,
    handleModuleChange,
    handleModuleBlur,
    handleAddModule,
    handleRemoveModule,
  }
}
