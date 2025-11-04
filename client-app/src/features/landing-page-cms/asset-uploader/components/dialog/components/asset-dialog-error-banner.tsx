import type { ValidationErrors } from '../../../data/schema'

interface AssetDialogErrorBannerProps {
  errors: ValidationErrors
}

export function AssetDialogErrorBanner({ errors }: AssetDialogErrorBannerProps) {
  if (!errors.files || Object.keys(errors.files).length === 0) {
    return null
  }

  return (
    <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
      <div className='space-y-2'>
        <p className='text-sm font-medium text-red-800'>
          Please fix the following issues:
        </p>
        <div className='space-y-1'>
          {[
            errors.files.uploadLimitExceeded,
            errors.files.invalidFileTypes,
            errors.files.fileSizeExceeded,
            errors.files.duplicateFileNames,
          ]
            .filter(Boolean)
            .map((error, index) => (
              <p key={index} className='text-sm text-red-700'>
                • {error}
              </p>
            ))}
        </div>
      </div>
    </div>
  )
}
