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
  useCreateRegisterForm,
  useUpdateRegisterForm,
} from '../../api/commands'
import type { RegisterFormDetail } from '../../data/schema'
import { INITIAL_VALIDATION_STATE } from '../../data/validation'
import { useRegisterFormManagement } from '../registration-form-management-provider'
import { RegisterFormDialogContent } from './components/registration-form-dialog-content'
import { ConfirmOverwriteDialog } from './confirm-overwrite-dialog'
import { useRegisterFormFormHandlers } from './hooks/use-registration-form-form-handlers'
import { useRegisterFormFormState } from './hooks/use-registration-form-form-state'
import { RegisterFormActionButtons } from './registration-form-action-buttons'

interface RegisterFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  registerForm?: RegisterFormDetail | null
}

export function RegisterFormDialog({
  open,
  onOpenChange,
  registerForm,
}: RegisterFormDialogProps) {
  const { t } = useTranslation('registration-form-management')
  const { countries, languages, modules } = useRegisterFormManagement()
  const isMediaIdInUse = registerForm?.isMediaIdInUse ?? false
  const [backendError, setBackendError] = useState<string | null>(null)

  const countryOptions = countries.map((country) => ({
    value: country.targetCountryCode,
    label: country.targetCountryName,
  }))

  const moduleOptions = modules.map((module) => ({
    value: module.moduleId.toString(),
    label: module.moduleName,
  }))

  const createRegisterFormMutation = useCreateRegisterForm((error) =>
    setBackendError(error)
  )
  const updateRegisterFormMutation = useUpdateRegisterForm((error) =>
    setBackendError(error)
  )

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
  } = useRegisterFormFormState(registerForm)

  const handlers = useRegisterFormFormHandlers({
    registerForm,
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
    createRegisterFormMutation,
    updateRegisterFormMutation,
  })

  const {
    isFormValid,
    handleSubmit,
    handleCancel,
    showConfirmOverwrite,
    handleConfirmOverwrite,
    handleCancelOverwrite,
  } = handlers

  useEffect(() => {
    if (open) {
      setBackendError(null)
      if (registerForm) {
        setCountry(registerForm.targetCountryCode)
        setLanguageOptions(
          languages
            .filter(
              (language) =>
                language.targetCountryCode === registerForm.targetCountryCode
            )
            .map((language) => ({
              value: language.languageCode,
              label: language.languageName,
            }))
        )
        setLanguage(registerForm.marketId)
        setFormWithFiles({
          module: registerForm.moduleName,
          files: [
            {
              file: new File([], ''),
              formName: registerForm.mediaName,
              fileName: registerForm.fileName.split('/').pop() || '',
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerForm, open])

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

        <RegisterFormDialogContent
          isEdit={isEdit}
          isMediaIdInUse={isMediaIdInUse}
          formWithFiles={formWithFiles}
          errors={errors}
          touched={touched}
          countryOptions={countryOptions}
          languageOptions={languageOptions}
          moduleOptions={moduleOptions}
          country={country}
          language={language}
          backendError={backendError}
          scrollContainerRef={scrollContainerRef}
          onCountryChange={handlers.handleCountryChange}
          onLanguageChange={handlers.handleLanguageChange}
          onCountryBlur={handlers.handleCountryBlur}
          onLanguageBlur={handlers.handleLanguageBlur}
          onFileChange={handlers.handleFileChange}
          onFormNameChange={handlers.handleFormNameChange}
          onFormNameBlur={handlers.handleFormNameBlur}
          onRemoveFile={handlers.handleRemoveFile}
        />

        <RegisterFormActionButtons
          isEdit={isEdit}
          isFormValid={isFormValid()}
          isLoading={
            createRegisterFormMutation.isPending ||
            updateRegisterFormMutation.isPending
          }
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />

        <ConfirmOverwriteDialog
          open={showConfirmOverwrite}
          onOpenChange={(open) => !open && handleCancelOverwrite()}
          fileName={registerForm?.mediaName || ''}
          onConfirm={handleConfirmOverwrite}
          onCancel={handleCancelOverwrite}
        />
      </DialogContent>
    </Dialog>
  )
}
