import React from 'react'
import type {
  ValidationErrors,
  FormWithFiles,
  TouchedFields,
} from '../../../data/schema'
import { RegisterFormDialogErrorBanner } from './registration-form-dialog-error-banner'
import { RegisterFormDialogInfoBanner } from './registration-form-dialog-info-banner'
import { RegisterFormFormContent } from './registration-form-form-content'

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
  backendError?: string | null
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
  backendError,
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

      {backendError && (
        <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
          <div className='space-y-2'>
            <p className='text-sm font-medium text-red-800'>Server Error</p>
            <div
              className='text-sm text-red-700'
              dangerouslySetInnerHTML={{ __html: backendError }}
            />
          </div>
        </div>
      )}

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
