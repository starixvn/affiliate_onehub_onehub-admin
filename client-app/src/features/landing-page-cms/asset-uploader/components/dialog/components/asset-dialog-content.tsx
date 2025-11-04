import { useRef } from 'react'
import type {
  ValidationErrors,
  ModuleWithFiles,
  TouchedFields,
} from '../../../data/schema'
import { AssetDialogErrorBanner } from './asset-dialog-error-banner'
import { AssetDialogInfoBanner } from './asset-dialog-info-banner'
import { AssetFormContent } from './asset-form-content'

interface AssetDialogContentProps {
  isEdit: boolean
  fileName: string
  moduleRows: ModuleWithFiles[]
  errors: ValidationErrors
  touched: TouchedFields
  expandedModules: Record<number, boolean>
  countryOptions: { value: string; label: string }[]
  languageOptions: { value: string; label: string }[]
  moduleOptions: { value: string; label: string }[]
  country: string
  language: string
  totalModules: number
  onCountryChange: (value: string) => void
  onLanguageChange: (value: string) => void
  onCountryBlur: () => void
  onLanguageBlur: () => void
  onModuleChange: (moduleIndex: number, module: string) => void
  onModuleBlur: (moduleIndex: number) => void
  onEditModuleChange: (module: string) => void
  onEditModuleBlur: () => void
  onEditFileChange: (files: FileList | null) => void
  onFileChange: (moduleIndex: number, files: FileList | null) => void
  onToggleExpanded: (moduleIndex: number) => void
  onAddModule: (moduleIndex: number) => void
  onRemoveModule: (moduleIndex: number) => void
  onRemoveFile: (moduleIndex: number, fileIndex: number) => void
  isModuleSelectedByOther: (
    moduleValue: string,
    currentModuleIndex: number
  ) => boolean
}

export function AssetDialogContent({
  isEdit,
  fileName,
  moduleRows,
  errors,
  touched,
  expandedModules,
  countryOptions,
  languageOptions,
  moduleOptions,
  country,
  language,
  totalModules,
  onCountryChange,
  onLanguageChange,
  onCountryBlur,
  onLanguageBlur,
  onModuleChange,
  onModuleBlur,
  onEditModuleChange,
  onEditModuleBlur,
  onEditFileChange,
  onFileChange,
  onToggleExpanded,
  onAddModule,
  onRemoveModule,
  onRemoveFile,
  isModuleSelectedByOther,
}: AssetDialogContentProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={scrollContainerRef}
      className='max-h-[calc(90vh-10rem)] space-y-4 overflow-y-auto px-1 pr-3 sm:px-0 sm:pr-2'
    >
      <AssetDialogErrorBanner errors={errors} />

      <AssetDialogInfoBanner isEdit={isEdit} />

      <AssetFormContent
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
        totalModules={totalModules}
        onCountryChange={onCountryChange}
        onLanguageChange={onLanguageChange}
        onCountryBlur={onCountryBlur}
        onLanguageBlur={onLanguageBlur}
        onModuleChange={onModuleChange}
        onModuleBlur={onModuleBlur}
        onEditModuleChange={onEditModuleChange}
        onEditModuleBlur={onEditModuleBlur}
        onEditFileChange={onEditFileChange}
        onFileChange={onFileChange}
        onToggleExpanded={onToggleExpanded}
        onAddModule={onAddModule}
        onRemoveModule={onRemoveModule}
        onRemoveFile={onRemoveFile}
        isModuleSelectedByOther={isModuleSelectedByOther}
      />
    </div>
  )
}
