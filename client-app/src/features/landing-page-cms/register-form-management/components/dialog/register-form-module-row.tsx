import { Upload, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImagePreviewCell } from '@/components/image-preview-cell'
import type {
  FormWithFiles,
  ValidationErrors,
  TouchedFields,
} from '../../data/schema'

interface RegisterFormModuleRowProps {
  moduleRow: FormWithFiles
  errors: ValidationErrors
  touched: TouchedFields
  modules: Array<{ value: string; label: string }>
  onFileChange: (files: FileList | null) => void
  onFormNameChange: (index: number, value: string) => void
  onFormNameBlur: (index: number) => void
  onRemoveFile: (fileIndex: number) => void
}

export function RegisterFormModuleRow({
  moduleRow,
  errors,
  touched,
  modules,
  onFileChange,
  onFormNameChange,
  onFormNameBlur,
  onRemoveFile,
}: RegisterFormModuleRowProps) {
  const { t } = useTranslation('register-form-management')

  return (
    <div className='space-y-4'>
      <div className='bg-card rounded-lg border p-4'>
        <div className='flex flex-col gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='module'>{t('form.module')}</Label>
            <div className='border-input bg-background ring-offset-background flex h-10 w-full rounded-md border px-3 py-2 text-sm'>
              {modules.find((m) => m.value === moduleRow.module)?.label ||
                moduleRow.module}
            </div>
          </div>
        </div>
      </div>

      <div className='bg-card rounded-lg border p-4'>
        <div className='space-y-2'>
          <Label>{t('form.uploadImages')}</Label>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <Upload className='mr-2 h-4 w-4' />
            {t('form.uploadImagesButton')}
          </Button>
          <input
            key={moduleRow.files.length}
            id='file-input'
            type='file'
            accept='.jpg,.jpeg,.png,.gif,.webp'
            multiple
            className='hidden'
            onChange={(e) => onFileChange(e.target.files)}
          />
        </div>
      </div>

      {moduleRow.files.length > 0 && (
        <div className='space-y-4'>
          {moduleRow.files.map((formFile, index) => (
            <div key={index} className='bg-card rounded-lg border p-4'>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor={`form-name-${index}`}>
                    {t('form.formName')} {index + 1}
                  </Label>
                  <div className='flex gap-2'>
                    <Input
                      id={`form-name-${index}`}
                      type='text'
                      value={formFile.formName}
                      onChange={(e) => onFormNameChange(index, e.target.value)}
                      onBlur={() => onFormNameBlur(index)}
                      placeholder={t('form.formNamePlaceholder')}
                      className={
                        touched.formNames[index] && errors.formNames?.[index]
                          ? 'border-destructive'
                          : ''
                      }
                      maxLength={200}
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='h-10 w-10 flex-shrink-0 p-0 text-red-600 hover:text-red-700'
                      onClick={() => onRemoveFile(index)}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                  {touched.formNames[index] && errors.formNames?.[index] && (
                    <p className='text-destructive text-xs'>
                      {errors.formNames[index]}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label>{t('form.imagePreview')}</Label>
                  <div className='flex items-center gap-4'>
                    <ImagePreviewCell
                      fileName={formFile.file.name}
                      imageUrl={URL.createObjectURL(formFile.file)}
                      thumbnailUrl={URL.createObjectURL(formFile.file)}
                    />
                    <div className='flex-1'>
                      <p className='text-sm font-medium'>
                        {formFile.file.name}
                      </p>
                      <p className='text-muted-foreground text-xs'>
                        {(formFile.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
