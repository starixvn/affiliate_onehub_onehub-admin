import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { ValidationErrors } from '../../../data/schema'

interface RegisterFormDialogErrorBannerProps {
  errors: ValidationErrors
}

export function RegisterFormDialogErrorBanner({
  errors,
}: RegisterFormDialogErrorBannerProps) {
  const { t } = useTranslation('registration-form-management')

  const hasErrors =
    errors.mediaInUse || (errors.files && Object.keys(errors.files).length > 0)

  if (!hasErrors) return null

  return (
    <Alert variant='destructive'>
      <AlertTriangle className='h-4 w-4' />
      <AlertDescription className='w-full'>
        <div className='space-y-2'>
          <div className='font-medium'>{t('form.fixIssues')}</div>
          <div className='space-y-1'>
            {errors.mediaInUse && (
              <div className='flex items-start gap-2 text-sm text-red-700'>
                <span className='flex-shrink-0'>•</span>
                <span className='break-words'>{errors.mediaInUse}</span>
              </div>
            )}
            {errors.files &&
              [
                errors.files.uploadLimitExceeded,
                errors.files.invalidFileTypes,
                errors.files.fileSizeExceeded,
                errors.files.duplicateFileNames,
                errors.files.fileNameTooLong,
                errors.files.fileNameInvalidChars,
                errors.files.formNameTooLong,
                errors.files.formNameInvalidChars,
              ]
                .filter(Boolean)
                .map((error, index) => (
                  <div
                    key={index}
                    className='flex items-start gap-2 text-sm text-red-700'
                  >
                    <span className='flex-shrink-0'>•</span>
                    <span className='break-words'>{error}</span>
                  </div>
                ))}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  )
}
