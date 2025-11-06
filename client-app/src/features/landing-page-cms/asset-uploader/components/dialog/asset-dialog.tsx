import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCreateAsset, useUpdateAsset } from '../../api/commands'
import type { AssetDetail } from '../../data/schema'
import { useAssetUploader } from '../asset-uploader-provider'
import { AssetActionButtons } from './asset-action-buttons'
import { AssetDialogContent } from './components/asset-dialog-content'
import { useAssetFormHandlers } from './hooks/use-asset-form-handlers'
import { useAssetFormState } from './hooks/use-asset-form-state'

interface AssetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  asset?: AssetDetail | null
}

export function AssetDialog({ open, onOpenChange, asset }: AssetDialogProps) {
  const { t } = useTranslation('asset-uploader')
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

  const {
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
  } = useAssetFormState(asset)

  const handlers = useAssetFormHandlers({
    asset,
    country,
    language,
    fileName,
    moduleRows,
    touched,
    isEdit,
    languages,
    setLanguageOptions,
    setCountry,
    setLanguage,
    setFileName,
    setModuleRows,
    setErrors,
    setTouched,
    setExpandedModules,
    resetForm,
    resetTouchedForModules,
    onOpenChange,
    createAssetMutation,
    updateAssetMutation,
  })

  useEffect(() => {
    if (open) {
      if (asset) {
        setCountry(asset.targetCountryCode)
        setLanguageOptions(
          languages
            .filter(
              (language) =>
                language.targetCountryCode === asset.targetCountryCode
            )
            .map((language) => ({
              value: language.languageCode,
              label: language.languageName,
            }))
        )
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

  useEffect(() => {
    if (
      errors.files &&
      Object.keys(errors.files).length > 0 &&
      scrollContainerRef.current
    ) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [errors.files])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('dialogs.editAsset') : t('dialogs.addNewAsset')}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? t('dialogs.editAssetDescription')
              : t('dialogs.addNewAssetDescription')}
          </DialogDescription>
        </DialogHeader>

        <AssetDialogContent
          isEdit={isEdit}
          fileName={fileName}
          moduleRows={moduleRows}
          errors={errors}
          touched={touched}
          expandedModules={expandedModules}
          countryOptions={countryOptions}
          languageOptions={languageOptions}
          moduleOptions={moduleOptions}
          country={country}
          language={language}
          totalModules={moduleRows.length}
          onCountryChange={handlers.handleCountryChange}
          onLanguageChange={handlers.handleLanguageChange}
          onCountryBlur={handlers.handleCountryBlur}
          onLanguageBlur={handlers.handleLanguageBlur}
          onModuleChange={handlers.handleModuleChange}
          onModuleBlur={handlers.handleModuleBlur}
          onEditModuleChange={handlers.handleEditModuleChange}
          onEditModuleBlur={handlers.handleEditModuleBlur}
          onEditFileChange={handlers.handleEditFileChange}
          onFileChange={handlers.handleFileChange}
          onToggleExpanded={handlers.handleToggleExpanded}
          onAddModule={handlers.handleAddModule}
          onRemoveModule={handlers.handleRemoveModule}
          onRemoveFile={handlers.handleRemoveFile}
          isModuleSelectedByOther={handlers.isModuleSelectedByOther}
        />

        <AssetActionButtons
          isEdit={isEdit}
          isFormValid={handlers.isFormValid()}
          isLoading={
            createAssetMutation.isPending || updateAssetMutation.isPending
          }
          onSubmit={handlers.handleSubmit}
          onCancel={handlers.handleCancel}
        />
      </DialogContent>
    </Dialog>
  )
}
