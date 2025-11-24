import { useTranslation } from 'react-i18next'
import { PageBuilderActions } from './page-builder-actions'
import { CopyLinkButton } from './copy-link-button'
import { PagePreviewIframe } from './page-preview-iframe'
import { usePageBuilder } from './page-builder-provider'

type PagePreviewSectionProps = {
  isDisabled: boolean
  isPreviewLoading: boolean
  previewError: string | null
  isIframeLoading: boolean
  onIframeLoad: () => void
  onIframeError: () => void
}

export function PagePreviewSection({
  isDisabled,
  isPreviewLoading,
  previewError,
  isIframeLoading,
  onIframeLoad,
  onIframeError,
}: PagePreviewSectionProps) {
  const { t } = useTranslation('page-builder')
  const { generatedResult } = usePageBuilder()

  return (
    <div className='h-full rounded-lg border p-4 lg:col-span-3'>
      <h3 className='mb-4 font-semibold'>{t('form.pagePreview')}</h3>
      
      <PageBuilderActions isDisabled={isDisabled} />

      <div className='mb-4 flex gap-2'>
        <CopyLinkButton />
        <div className='bg-muted/30 flex-1 rounded border p-2 text-xs text-muted-foreground break-all min-h-[2.5rem] flex items-center'>
          {generatedResult?.landingPageUrl || ''}
        </div>
      </div>

      <PagePreviewIframe
        url={generatedResult?.landingPageUrl}
        isPreviewLoading={isPreviewLoading}
        previewError={previewError}
        isIframeLoading={isIframeLoading}
        onLoad={onIframeLoad}
        onError={onIframeError}
      />
    </div>
  )
}

