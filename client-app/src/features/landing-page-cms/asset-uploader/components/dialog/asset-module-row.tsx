import { ChevronDown, ChevronRight, Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type {
  AssetModuleWithFiles,
  ValidationErrors,
  TouchedFields,
} from '../../data/schema'
import { TRANSLATION_KEY } from '../../data/schema'

interface AssetModuleRowProps {
  moduleIndex: number
  moduleRow: AssetModuleWithFiles
  isEdit: boolean
  fileName: string
  errors: ValidationErrors
  touched: TouchedFields
  expandedModules: Record<number, boolean>
  modules: Array<{ value: string; label: string }>
  totalModules: number
  onModuleChange: (moduleIndex: number, module: string) => void
  onModuleBlur: (moduleIndex: number) => void
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

export function AssetModuleRow({
  moduleIndex,
  moduleRow,
  isEdit,
  fileName,
  errors,
  touched,
  expandedModules,
  modules,
  totalModules,
  onModuleChange,
  onModuleBlur,
  onFileChange,
  onToggleExpanded,
  onAddModule,
  onRemoveModule,
  onRemoveFile,
  isModuleSelectedByOther,
}: AssetModuleRowProps) {
  const { t } = useTranslation(TRANSLATION_KEY)
  return (
    <div className='bg-card rounded-lg border p-4'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-4'>
        <div className='flex-1 space-y-2'>
          <Label htmlFor={`module-${moduleIndex}`}>
            {t('form.moduleNumber', { number: moduleIndex + 1 })}
          </Label>
          <Select
            value={moduleRow.module}
            onValueChange={(value) => onModuleChange(moduleIndex, value)}
            onOpenChange={(open) => {
              if (!open && !touched.modules?.[moduleIndex]) {
                onModuleBlur(moduleIndex)
              }
            }}
          >
            <SelectTrigger
              id={`module-${moduleIndex}`}
              title={t('form.modulePlaceholder')}
              className={
                touched.modules?.[moduleIndex] && errors.modules?.[moduleIndex]
                  ? 'border-destructive'
                  : ''
              }
            >
              <SelectValue placeholder={t('form.modulePlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {modules.map((m) => {
                const isDisabled = isModuleSelectedByOther(m.value, moduleIndex)
                return (
                  <SelectItem
                    key={m.value}
                    value={m.value}
                    disabled={isDisabled}
                  >
                    {m.label}
                    {isDisabled && t('form.selected')}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          {touched.modules?.[moduleIndex] && errors.modules?.[moduleIndex] && (
            <p className='text-destructive text-xs'>
              {errors.modules[moduleIndex]}
            </p>
          )}
        </div>
        <div className='-mt-1 space-y-2'>
          <Label className='text-sm font-medium'>{t('form.uploadFile')}</Label>
          <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-2'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              title={t('form.uploadFile')}
              className='w-full sm:w-auto'
              onClick={() =>
                document.getElementById(`file-input-${moduleIndex}`)?.click()
              }
            >
              <Upload className='mr-2 h-4 w-4' />
              <span className='sm:inline'>{t('form.uploadFileButton')}</span>
            </Button>
            <input
              key={`${moduleIndex}-${moduleRow.files.length}`}
              id={`file-input-${moduleIndex}`}
              type='file'
              accept='.jpg,.jpeg,.png,.gif,.webp'
              multiple={!isEdit}
              className='hidden'
              onChange={(e) => onFileChange(moduleIndex, e.target.files)}
            />
            {isEdit ? (
              <Button
                type='button'
                variant='ghost'
                size='sm'
                disabled
                className='h-8 w-full justify-center p-0 hover:bg-transparent sm:w-auto'
              >
                <Label className='text-muted-foreground text-sm font-medium'>
                  {fileName || t('form.noFileChosen')}
                </Label>
              </Button>
            ) : (
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='h-8 w-full justify-start p-0 hover:bg-transparent sm:w-auto'
                onClick={() => onToggleExpanded(moduleIndex)}
              >
                {expandedModules[moduleIndex] ? (
                  <ChevronDown className='mr-2 h-4 w-4' />
                ) : (
                  <ChevronRight className='mr-2 h-4 w-4' />
                )}
                <Label className='cursor-pointer text-sm font-medium'>
                  {moduleRow.files.length > 0
                    ? `(${moduleRow.files.length}) ${moduleRow.files.length > 1 ? t('form.files_plural') : t('form.files')}`
                    : t('form.noFileChosen')}
                </Label>
              </Button>
            )}
          </div>
        </div>
        {!isEdit && (
          <div className='mt-6 flex flex-col gap-2 sm:flex-row sm:gap-1'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              title={t('form.addNewModule')}
              className='w-full text-green-600 hover:text-green-700 sm:w-auto'
              onClick={() => onAddModule(moduleIndex)}
            >
              <span className='sm:hidden'>+</span>
              <span className='hidden sm:inline'>+</span> {t('form.add')}
            </Button>
            <Button
              type='button'
              variant='outline'
              size='sm'
              title={t('form.removeModule')}
              className='w-full border-red-200 text-red-600 hover:border-red-300 hover:text-red-700 sm:w-auto'
              disabled={totalModules === 1}
              onClick={() => onRemoveModule(moduleIndex)}
            >
              <span className='sm:hidden'>-</span>
              <span className='hidden sm:inline'>-</span> {t('form.remove')}
            </Button>
          </div>
        )}
      </div>

      {expandedModules[moduleIndex] && moduleRow.files.length > 0 && (
        <div className='mt-4 space-y-2'>
          <div className='space-y-1'>
            {moduleRow.files.map((file: File, fileIndex: number) => (
              <div
                key={fileIndex}
                className='bg-muted flex items-center gap-2 rounded p-2'
              >
                <span className='min-w-0 flex-1 truncate text-sm'>
                  {file.name}
                </span>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='h-6 w-6 flex-shrink-0 p-0 text-red-600 hover:text-red-700'
                  onClick={() => onRemoveFile(moduleIndex, fileIndex)}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
