import { useTranslation } from 'react-i18next'
import type { ValidationErrors } from '../schema'

interface MediaDialogErrorBannerProps {
  errors: ValidationErrors
  backendError?: string | null
  translationKey: string
}

export function MediaDialogErrorBanner({
  errors,
  backendError,
  translationKey,
}: MediaDialogErrorBannerProps) {
  const { t } = useTranslation(translationKey)

  const hasErrors =
    errors.mediaInUse ||
    errors.modulesWithoutFiles ||
    (errors.files && Object.keys(errors.files).length > 0)

  if (!hasErrors && !backendError) {
    return null
  }

  return (
    <div className='border-destructive/20 bg-destructive/5 rounded-lg border p-4'>
      <div className='space-y-2'>
        <p className='text-destructive text-sm font-medium'>
          {t('form.fixIssues')}
        </p>
        <div className='space-y-1'>
          {errors.mediaInUse && (
            <p className='text-destructive text-sm'>• {errors.mediaInUse}</p>
          )}
          {errors.modulesWithoutFiles && (
            <p className='text-destructive text-sm'>
              • {errors.modulesWithoutFiles}
            </p>
          )}
          {errors.files &&
            [
              errors.files.uploadLimitExceeded,
              errors.files.invalidFileTypes,
              errors.files.fileSizeExceeded,
              errors.files.duplicateFileNames,
              errors.files.fileNameInvalidChars,
              errors.files.fileNameTooLong,
              errors.files.formNameRequired,
              errors.files.formNameTooLong,
              errors.files.formNameInvalidChars,
            ]
              .filter(Boolean)
              .map((error, index) => (
                <p key={index} className='text-destructive text-sm'>
                  • {error}
                </p>
              ))}
          {backendError && (
            <p
              className='text-destructive text-sm'
              dangerouslySetInnerHTML={{ __html: backendError }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
