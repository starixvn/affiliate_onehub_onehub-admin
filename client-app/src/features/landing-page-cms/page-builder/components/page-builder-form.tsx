import { useEffect } from 'react'
import { useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Route } from '@/routes/iframe/landing-page-cms/page-builder'
import { isInIframe } from '@/lib/iframe-utils'
import { usePageBuilder } from './page-builder-provider'
import { useGetLanguages } from '../api/queries'
import { pageBuilderDefaultValues } from '../data/schema'
import { PageConfigurationForm } from './page-configuration-form'
import { ModuleComponentsSection } from './module-components-section'
import { PagePreviewSection } from './page-preview-section'
import { ResetConfirmDialog } from './reset-confirm-dialog'
import { PageBuilderDialogs } from './page-builder-dialogs'

export function PageBuilderForm() {
  const { t } = useTranslation('page-builder')
  const { 
    form, 
    isPreviewLoading, 
    setIsPreviewLoading, 
    isIframeLoading,
    setIsIframeLoading,
    previewError, 
    setPreviewError, 
    pageId, 
    resetToInitialData,
    dialogOpen,
    setDialogOpen,
    setGeneratedResult,
    isCloneMode,
  } = usePageBuilder()
  
  const { control } = form
  const isDisabled = isPreviewLoading || isIframeLoading
  const navigate = Route.useNavigate()

  const selectedCountryCode = useWatch({ control, name: 'country' })
  const { data: languages } = useGetLanguages(selectedCountryCode || '')

  useEffect(() => {
    if (languages && languages.length > 0 && selectedCountryCode) {
      const currentLanguage = form.getValues('language')
      const currentShortedLanguageCode = form.getValues('shortedLanguageCode')

      if (!currentLanguage || !currentShortedLanguageCode) {
        const firstLanguage = languages[0]
        if (firstLanguage) {
          form.setValue('language', firstLanguage.languageCode || '', { shouldValidate: true })
          form.setValue('shortedLanguageCode', firstLanguage.shortedLanguageCode || '', { shouldValidate: true })
        }
      }
    }
  }, [languages, selectedCountryCode, form])

  const performReset = () => {
    if (pageId) {
      resetToInitialData()
    } else {
      form.reset(pageBuilderDefaultValues)
      
      const inIframe = isInIframe()
      if (inIframe && window.top) {
        try {
          const currentUrl = new URL(window.top.location.href)
          window.top.history.replaceState({}, '', currentUrl.toString())
        } catch (error) {
          // Cannot access parent window due to sandbox restrictions
        }
      }
      
      navigate({
        to: '/iframe/landing-page-cms/page-builder',
        search: {
          pageId: undefined,
          pageid: undefined,
          isPreview: undefined,
          IsPreview: undefined,
          mode: undefined,
        },
        replace: true,
      })
    }
    
    setGeneratedResult(null)
    setPreviewError(null)
    setIsPreviewLoading(false)
    setIsIframeLoading(false)
    setDialogOpen(null)
  }

  const handleIframeLoad = () => {
    setIsIframeLoading(false)
  }

  const handleIframeError = () => {
    setIsIframeLoading(false)
    setPreviewError(t('errors.failedToLoadPreview'))
  }

  return (
    <div className='grid grid-cols-1 gap-4 lg:grid-cols-12'>
      <PageConfigurationForm form={form} isDisabled={isDisabled} />
      <ModuleComponentsSection form={form} isDisabled={isDisabled} />
      <PagePreviewSection
        isDisabled={isDisabled}
        isPreviewLoading={isPreviewLoading}
        previewError={previewError}
        isIframeLoading={isIframeLoading}
        onIframeLoad={handleIframeLoad}
        onIframeError={handleIframeError}
      />

      <ResetConfirmDialog
        open={dialogOpen === 'reset'}
        onOpenChange={(open) => setDialogOpen(open ? 'reset' : null)}
        onConfirm={performReset}
        isEditOrCloneMode={!!pageId || isCloneMode}
      />

      <PageBuilderDialogs />
    </div>
  )
}
