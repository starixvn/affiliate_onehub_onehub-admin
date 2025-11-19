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

interface RegisterFormEditFormProps {
  moduleValue: string
  modules: Array<{ value: string; label: string }>
  onFileChange: (files: FileList | null) => void
}

export function RegisterFormEditForm({
  moduleValue,
  modules,
  onFileChange,
}: RegisterFormEditFormProps) {
  const { t } = useTranslation('register-form-management')

  return (
    <div className='bg-card rounded-lg border p-4'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-4'>
        <div className='flex-1 space-y-2'>
          <Label htmlFor='edit-module'>{t('form.module')}</Label>
          <Select disabled={true} value={moduleValue}>
            <SelectTrigger id='edit-module' title={t('form.modulePlaceholder')}>
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
                document.getElementById('edit-file-input')?.click()
              }
            >
              <Upload className='mr-2 h-4 w-4' />
              <span className='sm:inline'>{t('form.uploadFileButton')}</span>
            </Button>
            <input
              id='edit-file-input'
              type='file'
              accept='.jpg,.jpeg,.png,.gif,.webp'
              className='hidden'
              onChange={(e) => onFileChange(e.target.files)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
