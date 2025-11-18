import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  MediaDialogActionButton,
  ConfirmOverwriteDialog,
  MediaDialogErrorBanner,
  MediaDialogInfoBanner,
  CountryLanguageSelects,
} from '@/features/landing-page-cms/shared'
import { TRANSLATION_KEY, type AssetDetail } from '../../data/schema'
import { INITIAL_VALIDATION_STATE } from '../../data/validation'
import { useAssetUploader } from '../asset-uploader-provider'
import { AssetEditForm } from './asset-edit-form'
import { AssetModuleRow } from './asset-module-row'
import { useAssetFormHandlers } from './hooks/use-asset-form-handlers'
import { useAssetFormState } from './hooks/use-asset-form-state'

interface AssetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: AssetDetail | null
}

export function AssetDialog({ open, onOpenChange, item }: AssetDialogProps) {
  const { t } = useTranslation(TRANSLATION_KEY)
  const {
    countries,
    languages,
    modules,
    maximumFiles,
    maxFileSize,
    allowedExtensions,
  } = useAssetUploader()
  const isMediaIdInUse = item?.isMediaIdInUse ?? false
  const [backendError, setBackendError] = useState<string | null>(null)

  const countryOptions = countries.map((country) => ({
    value: country.targetCountryCode,
    label: country.targetCountryName,
  }))

  const moduleOptions = modules.map((module) => ({
    value: module.moduleId.toString(),
    label: module.moduleName,
  }))

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
  } = useAssetFormState(item)

  const handlers = useAssetFormHandlers({
    item,
    country,
    language,
    fileName,
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
    resetForm,
    resetTouchedForModules,
    onOpenChange,
    onBackendError: setBackendError,
    fileConfig: {
      maximumFiles,
      maxFileSize,
      allowedExtensions,
    },
  })

  const {
    showConfirmOverwrite,
    handleConfirmOverwrite,
    handleCancelOverwrite,
    isPending,
  } = handlers

  useEffect(() => {
    if (open) {
      setBackendError(null)
      if (item) {
        setCountry(item.targetCountryCode)
        setLanguageOptions(
          languages
            .filter(
              (language) =>
                language.targetCountryCode === item.targetCountryCode
            )
            .map((language) => ({
              value: language.languageCode,
              label: language.languageName,
            }))
        )
        setLanguage(item.marketId)
        setFileName(item.mediaName)
        setModuleRows([{ module: item.moduleId.toString(), files: [] }])
        setErrors(INITIAL_VALIDATION_STATE.errors)
        resetTouchedForModules(1)
      } else {
        resetForm()
        resetTouchedForModules(1)
      }
    }
  }, [item, open, languages])

  useEffect(() => {
    if (
      ((errors.files && Object.keys(errors.files).length > 0) ||
        backendError) &&
      scrollContainerRef.current
    ) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [errors.files, backendError])

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

        <div
          ref={scrollContainerRef}
          className='max-h-[calc(90vh-10rem)] space-y-4 overflow-y-auto px-1 pr-3 sm:px-0 sm:pr-2'
        >
          <MediaDialogErrorBanner
            errors={errors}
            backendError={backendError}
            translationKey={TRANSLATION_KEY}
          />

          <MediaDialogInfoBanner
            isEdit={isEdit}
            translationKey={TRANSLATION_KEY}
          />

          <CountryLanguageSelects
            translationKey={TRANSLATION_KEY}
            isMediaIdInUse={isMediaIdInUse}
            errors={errors}
            touched={touched}
            countryOptions={countryOptions}
            languageOptions={languageOptions}
            country={country}
            language={language}
            onCountryChange={handlers.handleCountryChange}
            onLanguageChange={handlers.handleLanguageChange}
            onCountryBlur={handlers.handleCountryBlur}
            onLanguageBlur={handlers.handleLanguageBlur}
            showModuleField={false}
          />

          <div className='space-y-4'>
            {isEdit ? (
              <AssetEditForm
                isMediaIdInUse={isMediaIdInUse}
                moduleValue={moduleRows[0].module}
                fileName={fileName}
                errors={errors}
                touched={touched}
                modules={moduleOptions}
                onModuleChange={handlers.handleModuleChange}
                onModuleBlur={handlers.handleModuleBlur}
                onFileChange={handlers.handleFileChange}
              />
            ) : (
              moduleRows.map((moduleRow, moduleIndex) => (
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
                  onModuleChange={handlers.handleModuleChange}
                  onModuleBlur={handlers.handleModuleBlur}
                  onFileChange={handlers.handleFileChange}
                  onToggleExpanded={handlers.handleToggleExpanded}
                  onAddModule={handlers.handleAddModule}
                  onRemoveModule={handlers.handleRemoveModule}
                  onRemoveFile={handlers.handleRemoveFile}
                  isModuleSelectedByOther={handlers.isModuleSelectedByOther}
                />
              ))
            )}
          </div>
        </div>

        <MediaDialogActionButton
          translationKey={TRANSLATION_KEY}
          isEdit={isEdit}
          isFormValid={handlers.isFormValid()}
          isLoading={isPending}
          onSubmit={handlers.handleSubmit}
          onCancel={handlers.handleCancel}
        />

        <ConfirmOverwriteDialog
          translationKey={TRANSLATION_KEY}
          open={showConfirmOverwrite}
          onOpenChange={(open) => !open && handleCancelOverwrite()}
          fileName={fileName}
          onConfirm={handleConfirmOverwrite}
          onCancel={handleCancelOverwrite}
        />
      </DialogContent>
    </Dialog>
  )
}
