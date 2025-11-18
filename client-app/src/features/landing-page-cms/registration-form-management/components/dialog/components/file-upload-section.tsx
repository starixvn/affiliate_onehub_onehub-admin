import { useRef } from 'react'
import { Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { FormWithFiles } from '../../../data/schema'
import { TRANSLATION_KEY } from '../../../data/schema'

interface FileUploadSectionProps {
  isEdit: boolean
  formWithFiles: FormWithFiles
  onFileChange: (files: FileList | null) => void
}

export function FileUploadSection({
  isEdit,
  formWithFiles,
  onFileChange,
}: FileUploadSectionProps) {
  const { t } = useTranslation(TRANSLATION_KEY)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <div className='space-y-2'>
      <Label>{t('form.uploadFile')}</Label>
      <div className='flex items-center gap-4'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className='mr-2 h-4 w-4' />
          {t('form.uploadFileButton')}
        </Button>
        <span className='text-muted-foreground text-sm'>
          {formWithFiles.files.length > 0
            ? isEdit
              ? formWithFiles.files[0].file.name
              : `${formWithFiles.files.length} file(s) selected`
            : t('form.noFileChosen')}
        </span>
      </div>
      <input
        key={formWithFiles.files.length}
        type='file'
        accept='.jpg,.jpeg,.png,.gif,.webp'
        multiple={!isEdit}
        className='hidden'
        ref={fileInputRef}
        onChange={(e) => onFileChange(e.target.files)}
      />
    </div>
  )
}
