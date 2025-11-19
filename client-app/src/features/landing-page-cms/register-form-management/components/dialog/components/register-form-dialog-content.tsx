import React from 'react'
import type {
  ValidationErrors,
  FormWithFiles,
  TouchedFields,
} from '../../../data/schema'
import { RegisterFormDialogErrorBanner } from './register-form-dialog-error-banner'
import { RegisterFormDialogInfoBanner } from './register-form-dialog-info-banner'
import { RegisterFormFormContent } from './register-form-form-content'

interface RegisterFormDialogContentProps {
  isEdit: boolean
  isMediaIdInUse: boolean
  formWithFiles: FormWithFiles
  errors: ValidationErrors
  touched: TouchedFields
  countryOptions: { value: string; label: string }[]
  languageOptions: { value: string; label: string }[]
  moduleOptions: { value: string; label: string }[]
  country: string
  language: string
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
  onCountryChange: (value: string) => void
  onLanguageChange: (value: string) => void
  onCountryBlur: () => void
  onLanguageBlur: () => void
  onFileChange: (files: FileList | null) => void
  onFormNameChange: (index: number, value: string) => void
  onFormNameBlur: (index: number) => void
  onRemoveFile: (fileIndex: number) => void
}

export function RegisterFormDialogContent({
  isEdit,
  isMediaIdInUse,
  formWithFiles,
  errors,
  touched,
  countryOptions,
  languageOptions,
  moduleOptions,
  country,
  language,
  scrollContainerRef,
  onCountryChange,
  onLanguageChange,
  onCountryBlur,
  onLanguageBlur,
  onFileChange,
  onFormNameChange,
  onFormNameBlur,
  onRemoveFile,
}: RegisterFormDialogContentProps) {
  return (
    <div
      ref={scrollContainerRef}
      className='max-h-[calc(90vh-10rem)] space-y-4 overflow-y-auto px-1 pr-3 sm:px-0 sm:pr-2'
    >
      <RegisterFormDialogErrorBanner errors={errors} />

      <RegisterFormDialogInfoBanner isEdit={isEdit} />

      <RegisterFormFormContent
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
        onCountryChange={onCountryChange}
        onLanguageChange={onLanguageChange}
        onCountryBlur={onCountryBlur}
        onLanguageBlur={onLanguageBlur}
        onFileChange={onFileChange}
        onFormNameChange={onFormNameChange}
        onFormNameBlur={onFormNameBlur}
        onRemoveFile={onRemoveFile}
      />
    </div>
  )
}
