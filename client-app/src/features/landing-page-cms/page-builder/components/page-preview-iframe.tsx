import { useTranslation } from 'react-i18next'

type PagePreviewIframeProps = {
  url?: string
  isPreviewLoading: boolean
  previewError: string | null
  isIframeLoading: boolean
  onLoad: () => void
  onError: () => void
  statusId?: number
}

export function PagePreviewIframe({
  url,
  isPreviewLoading,
  previewError,
  isIframeLoading,
  onLoad,
  onError,
  statusId,
}: PagePreviewIframeProps) {
  const { t } = useTranslation('page-builder')
  
  const isInactive = statusId === 2

  const getIframeUrl = (iframeUrl: string) => {
    try {
      const urlObj = new URL(iframeUrl)
      urlObj.searchParams.set('Refresh', 'true')
      return urlObj.toString()
    } catch {
      const separator = iframeUrl.includes('?') ? '&' : '?'
      return `${iframeUrl}${separator}Refresh=true`
    }
  }

  return (
    <div className='aspect-[9/16] w-full overflow-hidden rounded border bg-muted/10 relative'>
      {isInactive && url ? (
        <div className='flex h-full flex-col items-center justify-center p-4 text-center'>
          <p className='text-destructive text-sm'>{t('form.inactiveStatusMessage')}</p>
        </div>
      ) : isPreviewLoading ? (
        <div className='absolute inset-0 flex items-center justify-center bg-background z-10'>
          <div className='flex flex-col items-center gap-2'>
            <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
            <p className='text-muted-foreground text-sm'>{t('form.loading')}</p>
          </div>
        </div>
      ) : previewError ? (
        <div className='flex h-full flex-col items-center justify-center p-4 text-center'>
          <p className='text-destructive text-sm'>{previewError}</p>
        </div>
      ) : url ? (
        <>
          {isIframeLoading && (
            <div className='absolute inset-0 flex items-center justify-center bg-background z-10'>
              <div className='flex flex-col items-center gap-2'>
                <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
                <p className='text-muted-foreground text-sm'>{t('form.loadingPreview')}</p>
              </div>
            </div>
          )}
          <iframe
            key={url}
            src={getIframeUrl(url)}
            className='h-full w-full border-0'
            onLoad={onLoad}
            onError={onError}
            title={t('form.pagePreview')}
          />
        </>
      ) : (
        <div className='flex h-full flex-col items-center justify-center p-4 text-center text-muted-foreground'>
          <div className='mb-2 text-4xl'>◫</div>
          <p className='text-xs'>
            {t('form.emptyStateTitle')}
          </p>
          <p className='mt-1 text-xs'>
            {t('form.emptyStateSubtitle')}
          </p>
        </div>
      )}
    </div>
  )
}

