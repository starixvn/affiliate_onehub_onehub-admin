import { useState } from 'react'
import type {
  AssetDetail,
  ModuleWithFiles,
  ValidationErrors,
  TouchedFields,
} from '../../../data/schema'
import { INITIAL_VALIDATION_STATE } from '../../../data/validation'

export function useAssetFormState(asset: AssetDetail | null | undefined) {
  const isEdit = !!asset

  const [languageOptions, setLanguageOptions] = useState<
    { value: string; label: string }[]
  >([])
  const [country, setCountry] = useState('')
  const [language, setLanguage] = useState('')
  const [fileName, setFileName] = useState('')
  const [moduleRows, setModuleRows] = useState<ModuleWithFiles[]>([
    { module: '', files: [] },
  ])
  const [errors, setErrors] = useState<ValidationErrors>(
    INITIAL_VALIDATION_STATE.errors
  )
  const [touched, setTouched] = useState<TouchedFields>(
    INITIAL_VALIDATION_STATE.touched
  )
  const [expandedModules, setExpandedModules] = useState<
    Record<number, boolean>
  >({})

  const resetForm = () => {
    setCountry('')
    setLanguage('')
    setFileName('')
    setModuleRows([{ module: '', files: [] }])
    setErrors(INITIAL_VALIDATION_STATE.errors)
    setTouched(INITIAL_VALIDATION_STATE.touched)
    setExpandedModules({})
  }

  const resetTouchedForModules = (moduleCount: number) => {
    setTouched((prev) => ({
      ...prev,
      modules: Object.fromEntries(
        Array.from({ length: moduleCount }, (_, i) => [i, false])
      ),
    }))
  }

  return {
    isEdit,
    languageOptions,
    setLanguageOptions,
    country,
    setCountry,
    language,
    setLanguage,
    fileName,
    setFileName,
    moduleRows,
    setModuleRows,
    errors,
    setErrors,
    touched,
    setTouched,
    expandedModules,
    setExpandedModules,
    resetForm,
    resetTouchedForModules,
  }
}
