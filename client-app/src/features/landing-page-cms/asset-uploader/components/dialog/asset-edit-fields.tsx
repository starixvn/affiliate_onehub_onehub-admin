import { useState, useEffect } from 'react'
import { Upload } from 'lucide-react'
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

interface AssetEditFieldsProps {
  moduleValue: string
  fileName: string
  errors: ValidationErrors
  touched: TouchedFields
  modules: Array<{ value: string; label: string }>
  onModuleChange: (module: string) => void
  onModuleBlur: () => void
  onFileChange: (files: FileList | null) => void
}

export function AssetEditFields({
  moduleValue: initialModule,
  fileName: initialFileName,
  errors,
  touched,
  modules,
  onModuleChange,
  onModuleBlur,
  onFileChange,
}: AssetEditFieldsProps) {
  const [moduleValue, setModuleValue] = useState(initialModule)
  const [fileName, setFileName] = useState(initialFileName)

  useEffect(() => {
    setModuleValue(initialModule)
  }, [initialModule])

  useEffect(() => {
    setFileName(initialFileName)
  }, [initialFileName])

  const handleModuleChange = (value: string) => {
    setModuleValue(value)
    onModuleChange(value)
  }

  const handleModuleBlur = () => {
    onModuleBlur()
  }

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const newFileName = files[0].name
      setFileName(newFileName)
    }
    onFileChange(files)
  }
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
      <div className='space-y-2'>
        <Label>Module</Label>
        <Select
          value={moduleValue}
          onValueChange={handleModuleChange}
          onOpenChange={(open) => {
            if (!open && !touched.modules[0]) {
              handleModuleBlur()
            }
          }}
        >
          <SelectTrigger
            className={
              touched.modules[0] && errors.modules[0]
                ? 'border-destructive'
                : ''
            }
          >
            <SelectValue placeholder='Select module' />
          </SelectTrigger>
          <SelectContent>
            {modules.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {touched.modules[0] && errors.modules[0] && (
          <p className='text-destructive text-xs'>
            {errors.modules[0]}
          </p>
        )}
      </div>

      <div className='space-y-2'>
        <Label>Upload File</Label>
        <div className='flex items-center gap-2'>
          <Button
            type='button'
            variant='outline'
            className='hover:border-input'
            onClick={() =>
              document.getElementById('file-input-edit')?.click()
            }
          >
            <Upload className='mr-2 h-4 w-4' />
            Upload File
          </Button>
          <input
            id='file-input-edit'
            type='file'
            accept='.jpg,.jpeg,.png,.gif,.webp'
            multiple={false}
            className='hidden'
            onChange={(e) => handleFileChange(e.target.files)}
          />
          <span className='text-sm text-muted-foreground flex-1'>
            {fileName || 'No file chosen'}
          </span>
        </div>
      </div>
    </div>
  )
}
