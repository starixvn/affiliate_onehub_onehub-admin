import type {
  FormWithFiles,
  ValidationErrors,
  TouchedFields,
} from '../../../data/schema'
import { CountryLanguageSelects } from './country-language-selects'
import { FileUploadSection } from './file-upload-section'
import { FormFileItem } from './form-file-item'

interface RegisterFormFormContentProps {
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
  onCountryChange: (value: string) => void
  onLanguageChange: (value: string) => void
  onCountryBlur: () => void
  onLanguageBlur: () => void
  onFileChange: (files: FileList | null) => void
  onFormNameChange: (index: number, value: string) => void
  onFormNameBlur: (index: number) => void
  onRemoveFile: (fileIndex: number) => void
}

export function RegisterFormFormContent({
  isEdit,
  isMediaIdInUse,
  formWithFiles,
  errors,
  touched,
  countryOptions,
  languageOptions,
  moduleOptions: _moduleOptions,
  country,
  language,
  onCountryChange,
  onLanguageChange,
  onCountryBlur,
  onLanguageBlur,
  onFileChange,
  onFormNameChange,
  onFormNameBlur,
  onRemoveFile,
}: RegisterFormFormContentProps) {
  if (isEdit) {
    return (
      <div className='space-y-6'>
        <CountryLanguageSelects
          isMediaIdInUse={isMediaIdInUse}
          formWithFiles={formWithFiles}
          errors={errors}
          touched={touched}
          countryOptions={countryOptions}
          languageOptions={languageOptions}
          country={country}
          language={language}
          onCountryChange={onCountryChange}
          onLanguageChange={onLanguageChange}
          onCountryBlur={onCountryBlur}
          onLanguageBlur={onLanguageBlur}
        />

        <FileUploadSection
          isEdit={isEdit}
          formWithFiles={formWithFiles}
          onFileChange={onFileChange}
        />

        {formWithFiles.files.length > 0 && (
          <div className='space-y-4'>
            <FormFileItem
              index={0}
              formFile={formWithFiles.files[0]}
              errors={errors}
              touched={touched}
              onFormNameChange={onFormNameChange}
              onFormNameBlur={onFormNameBlur}
              onRemoveFile={onRemoveFile}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <CountryLanguageSelects
        isMediaIdInUse={isMediaIdInUse}
        formWithFiles={formWithFiles}
        errors={errors}
        touched={touched}
        countryOptions={countryOptions}
        languageOptions={languageOptions}
        country={country}
        language={language}
        onCountryChange={onCountryChange}
        onLanguageChange={onLanguageChange}
        onCountryBlur={onCountryBlur}
        onLanguageBlur={onLanguageBlur}
      />

      <FileUploadSection
        isEdit={isEdit}
        formWithFiles={formWithFiles}
        onFileChange={onFileChange}
      />

      {formWithFiles.files.length > 0 && (
        <div className='space-y-4'>
          {formWithFiles.files.map((formFile, index) => (
            <FormFileItem
              key={index}
              index={index}
              formFile={formFile}
              errors={errors}
              touched={touched}
              onFormNameChange={onFormNameChange}
              onFormNameBlur={onFormNameBlur}
              onRemoveFile={onRemoveFile}
            />
          ))}
        </div>
      )}
    </div>
  )
}
