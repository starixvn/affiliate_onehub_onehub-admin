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
  MediaDialogInfoBanner,
  MediaDialogErrorBanner,
  CountryLanguageSelects,
} from '@/features/landing-page-cms/shared'
import {
  TRANSLATION_KEY,
  type FormFile,
  type RegisterFormDetail,
} from '../../data/schema'
import { INITIAL_VALIDATION_STATE } from '../../data/validation'
import { useRegisterFormManagement } from '../registration-form-management-provider'
import { FileUploadSection } from './components/file-upload-section'
import { FormFileItem } from './components/form-file-item'
import { useRegisterFormFormHandlers } from './hooks/use-registration-form-form-handlers'
import { useRegisterFormFormState } from './hooks/use-registration-form-form-state'

interface RegisterFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: RegisterFormDetail | null
}

export function RegisterFormDialog({
  open,
  onOpenChange,
  item,
}: RegisterFormDialogProps) {
  const { t } = useTranslation(TRANSLATION_KEY)
  const { countries, languages, maximumFiles, maxFileSize, allowedExtensions } =
    useRegisterFormManagement()
  const isMediaIdInUse = item?.isMediaIdInUse ?? false
  const [backendError, setBackendError] = useState<string | null>(null)

  const countryOptions = countries.map((country) => ({
    value: country.targetCountryCode,
    label: country.targetCountryName,
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
    formWithFiles,
    setFormWithFiles,
    errors,
    setErrors,
    touched,
    setTouched,
    resetForm,
    resetTouchedForFormNames,
  } = useRegisterFormFormState(item)

  const handlers = useRegisterFormFormHandlers({
    item,
    country,
    language,
    formWithFiles,
    touched,
    isEdit,
    isMediaIdInUse,
    countries,
    languages,
    setLanguageOptions,
    setCountry,
    setLanguage,
    setFormWithFiles,
    setErrors,
    setTouched,
    resetTouchedForFormNames,
    onOpenChange,
    onBackendError: setBackendError,
    fileConfig: {
      maximumFiles,
      maxFileSize,
      allowedExtensions,
    },
  })

  const {
    isFormValid,
    handleSubmit,
    handleCancel,
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
        setFormWithFiles({
          module: item.moduleName,
          files: [
            {
              file: new File([], ''),
              formName: item.mediaName,
              fileName: item.fileName.split('/').pop() || '',
            },
          ],
        })

        setErrors(INITIAL_VALIDATION_STATE.errors)
        resetTouchedForFormNames(1)
      } else {
        resetForm()
        resetTouchedForFormNames(1)
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

  const filesToRender = isEdit
    ? formWithFiles.files.slice(0, 1)
    : formWithFiles.files

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex max-h-[90vh] w-[95vw] flex-col sm:max-w-2xl md:max-w-3xl lg:max-w-4xl'>
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? t('dialogs.editRegisterForm')
              : t('dialogs.addNewRegisterForm')}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? t('dialogs.editRegisterFormDescription')
              : t('dialogs.addNewRegisterFormDescription')}
          </DialogDescription>
        </DialogHeader>

        <div
          ref={scrollContainerRef}
          className='min-h-0 flex-1 space-y-4 overflow-y-auto border-b px-1 pr-3 sm:px-0 sm:pr-2'
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

          <div className='space-y-6'>
            <CountryLanguageSelects
              translationKey={TRANSLATION_KEY}
              isMediaIdInUse={isMediaIdInUse}
              module={formWithFiles.module}
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
              showModuleField={true}
            />

            <FileUploadSection
              isEdit={isEdit}
              formWithFiles={formWithFiles}
              onFileChange={handlers.handleFileChange}
            />

            {filesToRender.length > 0 && (
              <div className='space-y-4'>
                {filesToRender.map((formFile: FormFile, index: number) => (
                  <FormFileItem
                    key={index}
                    index={index}
                    formFile={formFile}
                    errors={errors}
                    touched={touched}
                    isEdit={isEdit}
                    onFormNameChange={handlers.handleFormNameChange}
                    onFormNameBlur={handlers.handleFormNameBlur}
                    onRemoveFile={handlers.handleRemoveFile}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <MediaDialogActionButton
          translationKey={TRANSLATION_KEY}
          isEdit={isEdit}
          isFormValid={isFormValid()}
          isLoading={isPending}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />

        <ConfirmOverwriteDialog
          translationKey={TRANSLATION_KEY}
          open={showConfirmOverwrite}
          onOpenChange={(open) => !open && handleCancelOverwrite()}
          fileName={
            formWithFiles.files[0]?.file.name ||
            item?.fileName.split('/').pop() ||
            ''
          }
          onConfirm={handleConfirmOverwrite}
          onCancel={handleCancelOverwrite}
        />
      </DialogContent>
    </Dialog>
  )
}
