import type {
  ModuleWithFiles,
  ValidationErrors,
  TouchedFields,
} from '../../../data/schema'
import { AssetBasicFields } from '../asset-basic-fields'
import { AssetEditForm } from '../asset-edit-form'
import { AssetModuleRow } from '../asset-module-row'

interface AssetFormContentProps {
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

export function AssetFormContent({
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
}: AssetFormContentProps) {
  if (isEdit) {
    return (
      <div className='space-y-4'>
        <AssetBasicFields
          countryOptions={countryOptions}
          languageOptions={languageOptions}
          country={country}
          language={language}
          errors={errors}
          touched={touched}
          onCountryChange={onCountryChange}
          onLanguageChange={onLanguageChange}
          onCountryBlur={onCountryBlur}
          onLanguageBlur={onLanguageBlur}
        />
        <AssetEditForm
          moduleValue={moduleRows[0].module}
          fileName={fileName}
          errors={errors}
          touched={touched}
          modules={moduleOptions}
          onModuleChange={onEditModuleChange}
          onModuleBlur={onEditModuleBlur}
          onFileChange={onEditFileChange}
        />
      </div>
    )
  }

  return (
    <>
      <AssetBasicFields
        countryOptions={countryOptions}
        languageOptions={languageOptions}
        country={country}
        language={language}
        errors={errors}
        touched={touched}
        onCountryChange={onCountryChange}
        onLanguageChange={onLanguageChange}
        onCountryBlur={onCountryBlur}
        onLanguageBlur={onLanguageBlur}
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
            totalModules={totalModules}
            onModuleChange={onModuleChange}
            onModuleBlur={onModuleBlur}
            onFileChange={onFileChange}
            onToggleExpanded={onToggleExpanded}
            onAddModule={onAddModule}
            onRemoveModule={onRemoveModule}
            onRemoveFile={onRemoveFile}
            isModuleSelectedByOther={isModuleSelectedByOther}
          />
        ))}
      </div>
    </>
  )
}
