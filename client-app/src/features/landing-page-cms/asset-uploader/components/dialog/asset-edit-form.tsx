import { useState, useEffect, useRef } from 'react'
import { Upload } from 'lucide-react'
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
import type { ValidationErrors, TouchedFields } from '../../data/schema'
import { TRANSLATION_KEY } from '../../data/schema'

const MODULE_INDEX = 0

interface AssetEditFormProps {
  isMediaIdInUse: boolean
  moduleValue: string
  fileName: string
  errors: ValidationErrors
  touched: TouchedFields
  modules: Array<{ value: string; label: string }>
  onModuleChange: (moduleIndex: number, module: string) => void
  onModuleBlur: (moduleIndex: number) => void
  onFileChange: (moduleIndex: number, files: FileList | null) => void
}

export function AssetEditForm({
  isMediaIdInUse,
  moduleValue: initialModule,
  fileName: initialFileName,
  errors,
  touched,
  modules,
  onModuleChange,
  onModuleBlur,
  onFileChange,
}: AssetEditFormProps) {
  const { t } = useTranslation(TRANSLATION_KEY)
  const [moduleValue, setModuleValue] = useState(initialModule)
  const [fileName, setFileName] = useState(initialFileName)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setModuleValue(initialModule)
  }, [initialModule])

  useEffect(() => {
    setFileName(initialFileName)
  }, [initialFileName])

  const handleModuleChange = (value: string) => {
    setModuleValue(value)
    onModuleChange(MODULE_INDEX, value)
  }

  const handleModuleBlur = () => {
    onModuleBlur(MODULE_INDEX)
  }

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const newFileName = files[0].name
      setFileName(newFileName)
    }
    onFileChange(MODULE_INDEX, files)
  }
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
      <div className='space-y-2'>
        <Label>{t('form.module')}</Label>
        <Select
          disabled={isMediaIdInUse}
          value={moduleValue}
          onValueChange={handleModuleChange}
          onOpenChange={(open) => {
            if (!open && !touched.modules?.[MODULE_INDEX]) {
              handleModuleBlur()
            }
          }}
        >
          <SelectTrigger
            className={
              touched.modules?.[MODULE_INDEX] && errors.modules?.[MODULE_INDEX]
                ? 'border-destructive'
                : ''
            }
          >
            <SelectValue placeholder={t('form.modulePlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {modules.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {touched.modules?.[MODULE_INDEX] && errors.modules?.[MODULE_INDEX] && (
          <p className='text-destructive text-xs'>
            {errors.modules?.[MODULE_INDEX]}
          </p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='asset-file-input'>{t('form.uploadFile')}</Label>
        <div className='flex items-center gap-2'>
          <Button
            type='button'
            variant='outline'
            className='hover:border-input'
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className='mr-2 h-4 w-4' />
            {t('form.uploadFileButton')}
          </Button>
          <input
            id='asset-file-input'
            key={fileName}
            type='file'
            accept='.jpg,.jpeg,.png,.gif,.webp'
            multiple={false}
            className='hidden'
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e.target.files)}
            aria-label={t('form.uploadFile')}
          />
          <span className='text-muted-foreground flex-1 text-sm'>
            {fileName || t('form.noFileChosen')}
          </span>
        </div>
      </div>
    </div>
  )
}
