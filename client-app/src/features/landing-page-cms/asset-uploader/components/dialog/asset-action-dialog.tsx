import { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCreateAsset, useUpdateAsset } from '../../api/commands'
import type {
  AssetDetail,
  ModuleWithFiles,
  ValidationErrors,
  TouchedFields,
} from '../../data/schema'
import {
  INITIAL_VALIDATION_STATE,
  validateField as validateFieldHelper,
  validateForm as validateFormHelper,
  isFormValid as isFormValidHelper,
  resetFileErrors,
} from '../../data/validation'
import { useAssetUploader } from '../asset-uploader-provider'
import { AssetActionButtons } from './asset-action-buttons'
import { AssetEditFields } from './asset-edit-fields'
import { AssetFormFields } from './asset-form-fields'
import { AssetModuleRow } from './asset-module-row'

interface AssetActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  asset?: AssetDetail | null
}

export function AssetActionDialog({
  open,
  onOpenChange,
  asset,
}: AssetActionDialogProps) {
  const isEdit = !!asset
  const { countries, languages, modules } = useAssetUploader()
  const countryOptions = countries.map((country) => ({
    value: country.targetCountryCode,
    label: country.targetCountryName,
  }))

  const moduleOptions = modules.map((module) => ({
    value: module.moduleId.toString(),
    label: module.moduleName,
  }))

  const createAssetMutation = useCreateAsset()
  const updateAssetMutation = useUpdateAsset()

  const scrollContainerRef = useRef<HTMLDivElement>(null)

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

  const isModuleSelectedByOther = (
    moduleValue: string,
    currentModuleIndex: number
  ) => {
    return moduleRows.some(
      (row, index) => index !== currentModuleIndex && row.module === moduleValue
    )
  }

  const markFieldTouched = (field: 'country' | 'language', index?: number) => {
    if (index !== undefined) {
      setTouched((prev) => ({
        ...prev,
        modules: { ...prev.modules, [index]: true },
      }))
    } else {
      setTouched((prev) => ({ ...prev, [field]: true }))
    }
  }

  const validateField = (field: string, value: any, index?: number) => {
    return validateFieldHelper(field, value, setErrors, index)
  }

  const validateForm = (): boolean => {
    return validateFormHelper(country, language, moduleRows, setErrors)
  }

  const isFormValid = () => {
    return isFormValidHelper(country, language, fileName, moduleRows, isEdit)
  }

  const handleCountryChange = (value: string) => {
    setCountry(value)
    validateField('country', value)
    const languageByCountry = languages.filter(
      (language) => language.targetCountryCode === value
    )
    if (languageByCountry.length > 0) {
      setLanguageOptions(
        languageByCountry.map((language) => ({
          value: language.languageCode,
          label: language.languageName,
        }))
      )
      setLanguage(languageByCountry[0].languageCode)
    }
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    validateField('language', value)
  }

  const handleCountryBlur = () => {
    markFieldTouched('country')
    validateField('country', country)
  }

  const handleLanguageBlur = () => {
    markFieldTouched('language')
    validateField('language', language)
  }

  const handleModuleChange = (moduleIndex: number, module: string) => {
    setModuleRows((prev) =>
      prev.map((row, i) => (i === moduleIndex ? { ...row, module } : row))
    )
    if (touched.modules[moduleIndex]) {
      validateField('module', module, moduleIndex)
    }
  }

  const handleModuleBlur = (moduleIndex: number) => {
    markFieldTouched('country', moduleIndex)
    validateField('module', moduleRows[moduleIndex].module, moduleIndex)
  }

  const handleEditModuleChange = (module: string) => {
    setModuleRows((prev) =>
      prev.map((row, i) => (i === 0 ? { ...row, module } : row))
    )
    if (touched.modules[0]) {
      validateField('module', module, 0)
    }
  }

  const handleEditModuleBlur = () => {
    markFieldTouched('country', 0)
    validateField('module', moduleRows[0].module, 0)
  }

  const handleEditFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      resetFileErrors(setErrors)
      const newFile = files[0]
      setModuleRows((prev) =>
        prev.map((row, i) => (i === 0 ? { ...row, files: [newFile] } : row))
      )
      setFileName(newFile.name)
    }
  }

  const handleFileChange = (moduleIndex: number, files: FileList | null) => {
    if (files && files.length > 0) {
      resetFileErrors(setErrors)

      if (isEdit) {
        const newFile = files[0]
        setModuleRows((prev) =>
          prev.map((row, i) =>
            i === moduleIndex ? { ...row, files: [newFile] } : row
          )
        )
        setFileName(newFile.name)
      } else {
        const newFiles = Array.from(files)

        const existingFileNames = moduleRows[moduleIndex].files.map(
          (f) => f.name
        )
        const filteredNewFiles = newFiles.filter(
          (newFile) => !existingFileNames.includes(newFile.name)
        )

        if (filteredNewFiles.length > 0) {
          setModuleRows((prev) =>
            prev.map((row, i) =>
              i === moduleIndex
                ? { ...row, files: [...row.files, ...filteredNewFiles] }
                : row
            )
          )

          if (moduleIndex === 0) {
            setFileName(filteredNewFiles[0].name)
          }
        }
      }
    }
  }

  const handleToggleExpanded = (moduleIndex: number) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleIndex]: !prev[moduleIndex],
    }))
  }

  const handleAddModule = (moduleIndex: number) => {
    if (!isEdit) {
      setModuleRows((prev) => {
        const newRows = [...prev]
        newRows.splice(moduleIndex + 1, 0, { module: '', files: [] })
        return newRows
      })
      resetTouchedForModules(moduleRows.length + 1)
    }
  }

  const handleRemoveModule = (moduleIndex: number) => {
    if (moduleRows.length > 1) {
      setModuleRows((prev) => prev.filter((_, i) => i !== moduleIndex))
      resetTouchedForModules(moduleRows.length - 1)
    }
  }

  const handleRemoveFile = (moduleIndex: number, fileIndex: number) => {
    setModuleRows((prev) =>
      prev.map((row, i) =>
        i === moduleIndex
          ? { ...row, files: row.files.filter((_, fi) => fi !== fileIndex) }
          : row
      )
    )
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    if (isEdit) {
      const request = prepareUpdateRequest()
      const response = await updateAssetMutation.mutateAsync({
        id: asset!.mediaId,
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

  const handleCancel = () => {
    resetForm()
    onOpenChange(false)
  }

  useEffect(() => {
    if (
      errors.files &&
      Object.keys(errors.files).length > 0 &&
      scrollContainerRef.current
    ) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [errors.files])

  useEffect(() => {
    if (open) {
      if (asset) {
        setCountry(asset.targetCountryCode)
        setLanguage(asset.marketId)
        setFileName(asset.mediaName)
        setModuleRows([{ module: asset.moduleId.toString(), files: [] }])
        resetTouchedForModules(1)
      } else {
        resetForm()
        resetTouchedForModules(1)
      }
    }
  }, [asset, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl'>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Asset' : 'Add New Asset'}</DialogTitle>
        </DialogHeader>

        <div
          ref={scrollContainerRef}
          className='max-h-[calc(90vh-10rem)] space-y-4 overflow-y-auto px-1 pr-3 sm:px-0 sm:pr-2'
        >
          {errors.files && Object.keys(errors.files).length > 0 && (
            <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
              <div className='space-y-2'>
                <p className='text-sm font-medium text-red-800'>
                  Please fix the following issues:
                </p>
                <div className='space-y-1'>
                  {[
                    errors.files.uploadLimitExceeded,
                    errors.files.invalidFileTypes,
                    errors.files.fileSizeExceeded,
                    errors.files.duplicateFileNames,
                  ]
                    .filter(Boolean)
                    .map((error, index) => (
                      <p key={index} className='text-sm text-red-700'>
                        • {error}
                      </p>
                    ))}
                </div>
              </div>
            </div>
          )}

          <div className='bg-muted rounded-lg p-4'>
            <div className='text-muted-foreground space-y-1 text-sm'>
              <p>Valid Types: .jpg, .jpeg, .png, .gif, .webp</p>
              <p>File Size Limit: 3MB</p>
              {!isEdit && <p>Maximum files: 50</p>}
            </div>
            <div className='text-muted-foreground mt-3 text-sm italic'>
              <span className='font-medium not-italic'>Note:</span> Module,
              Country, and Language cannot be changed if the image is already
              used in an existing landing page.
            </div>
          </div>

          {isEdit ? (
            <div className='space-y-4'>
              <AssetFormFields
                countryOptions={countryOptions}
                languageOptions={languageOptions}
                country={country}
                language={language}
                errors={errors}
                touched={touched}
                onCountryChange={handleCountryChange}
                onLanguageChange={handleLanguageChange}
                onCountryBlur={handleCountryBlur}
                onLanguageBlur={handleLanguageBlur}
              />
              <AssetEditFields
                moduleValue={moduleRows[0].module}
                fileName={fileName}
                errors={errors}
                touched={touched}
                modules={moduleOptions}
                onModuleChange={handleEditModuleChange}
                onModuleBlur={handleEditModuleBlur}
                onFileChange={handleEditFileChange}
              />
            </div>
          ) : (
            <>
              <AssetFormFields
                countryOptions={countryOptions}
                languageOptions={languageOptions}
                country={country}
                language={language}
                errors={errors}
                touched={touched}
                onCountryChange={handleCountryChange}
                onLanguageChange={handleLanguageChange}
                onCountryBlur={handleCountryBlur}
                onLanguageBlur={handleLanguageBlur}
              />

              <div className='space-y-4'>
                {moduleRows.map((moduleRow, moduleIndex) => (
                  <AssetModuleRow
                    key={moduleIndex}
                    moduleIndex={moduleIndex}
                    moduleRow={moduleRow}
                    isEdit={isEdit}
                    fileName={fileName}
                    errors={errors}
                    touched={touched}
                    expandedModules={expandedModules}
                    modules={moduleOptions}
                    totalModules={moduleRows.length}
                    onModuleChange={handleModuleChange}
                    onModuleBlur={handleModuleBlur}
                    onFileChange={handleFileChange}
                    onToggleExpanded={handleToggleExpanded}
                    onAddModule={handleAddModule}
                    onRemoveModule={handleRemoveModule}
                    onRemoveFile={handleRemoveFile}
                    isModuleSelectedByOther={isModuleSelectedByOther}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <AssetActionButtons
          isEdit={isEdit}
          isFormValid={isFormValid()}
          isLoading={
            createAssetMutation.isPending || updateAssetMutation.isPending
          }
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  )
}
