interface AssetDialogInfoBannerProps {
  isEdit: boolean
}

export function AssetDialogInfoBanner({ isEdit }: AssetDialogInfoBannerProps) {
  return (
    <div className='bg-muted rounded-lg p-4'>
      <div className='text-muted-foreground space-y-1 text-sm'>
        <p>Valid Types: .jpg, .jpeg, .png, .gif, .webp</p>
        <p>File Size Limit: 3MB</p>
        {!isEdit && <p>Maximum files: 50</p>}
      </div>
      <div className='text-muted-foreground mt-3 text-sm italic'>
        <span className='font-medium not-italic'>Note:</span> Module,
        Country, and Language cannot be changed if the image is already
        used in an existing landing page.
      </div>
    </div>
  )
}
