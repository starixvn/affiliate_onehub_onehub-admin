import { useTranslation } from 'react-i18next'
import { Eye, FilePlus, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePageBuilder } from './page-builder-provider'
import { useCreatePageBuilder, useUpdatePageBuilder } from '../api/commands'
import { useGetModules } from '../api/queries'
import type { CreatePageBuilderResult } from '../types'
import type { PageBuilderFormValues } from '../data/schema'

type PageBuilderActionsProps = {
  isDisabled: boolean
}

export function PageBuilderActions({ isDisabled }: PageBuilderActionsProps) {
  const { t } = useTranslation('page-builder')
  const { 
    form, 
    pageId, 
    setGeneratedResult, 
    setIsPreviewLoading, 
    setIsIframeLoading, 
    setPreviewError,
    setDialogOpen 
  } = usePageBuilder()
  
  const createPageBuilderMutation = useCreatePageBuilder()
  const updatePageBuilderMutation = useUpdatePageBuilder()
  const isEditMode = !!pageId
  const pageBuilderMutation = isEditMode ? updatePageBuilderMutation : createPageBuilderMutation
  const { isPreviewLoading } = usePageBuilder()
  const { data: modules } = useGetModules()

  const mapModulesToComponentSettings = (modulesData: PageBuilderFormValues['modules']) => {
    const result: Array<{
      moduleId: number
      mediaId: number | null
      extraInfo: string
      orderId: number
    }> = []

    modulesData.forEach((module, index) => {
      if (!module.moduleId) {
        throw new Error(`Module at index ${index} is missing moduleId`)
      }

      const moduleId = module.moduleId
      const selectedModule = modules?.find((m) => m.moduleId === moduleId)
      const moduleType = selectedModule?.moduleType
      const isMultipleUpload = selectedModule?.isMultipleUpload ?? false
      const orderId = index + 1

      if (isMultipleUpload && module.sourceId) {
        const sourceIds = module.sourceId.split(',').filter(Boolean)
        sourceIds.forEach((sourceIdStr) => {
          const parsedMediaId = Number.parseInt(sourceIdStr.trim(), 10)
          if (!Number.isNaN(parsedMediaId)) {
            result.push({
              moduleId,
              mediaId: parsedMediaId,
              extraInfo: '',
              orderId,
            })
          }
        })
      } else {
        let mediaId: number | null = null
        if (moduleType !== 2 && moduleType !== 4 && module.sourceId) {
          const parsedMediaId = Number.parseInt(module.sourceId, 10)
          mediaId = Number.isNaN(parsedMediaId) ? null : parsedMediaId
        }

        let extraInfo = ''
        if (moduleType === 2) {
          extraInfo = module.contactPath || ''
        } else if (moduleType === 4) {
          extraInfo = module.sourceId || ''
        }

        result.push({
          moduleId,
          mediaId,
          extraInfo,
          orderId,
        })
      }
    })

    return result
  }

  const handlePreviewPage = form.handleSubmit(
    (data) => {
      let hasContactPathError = false
      data.modules.forEach((module, index) => {
        if (module.moduleId && modules) {
          const selectedModule = modules.find((m) => m.moduleId === module.moduleId)
          if (selectedModule?.moduleType === 2 && !module.contactPath?.trim()) {
            form.setError(`modules.${index}.contactPath`, {
              type: 'required',
              message: t('form.contactPathRequired'),
            })
            hasContactPathError = true
          }
        }
      })

      if (hasContactPathError) {
        return
      }

      setIsPreviewLoading(true)
      setPreviewError(null)
      setIsIframeLoading(true)

      const moduleComponentSettings = mapModulesToComponentSettings(data.modules)

      const request = {
        pageName: data.pageName,
        pageCode: data.pageCode,
        campaignId: Number.parseInt(data.campaign, 10) || 0,
        targetCountryCode: data.country || '',
        languageCode: data.language || '',
        isPreview: true,
        statusId: data.statusId || 0,
        ...(isEditMode && pageId ? { pageId } : {}),
        moduleComponentSettings,
      }

      pageBuilderMutation.mutate(request, {
        onSuccess: (result: CreatePageBuilderResult | undefined) => {
          if (result?.landingPageUrl) {
            setGeneratedResult(result)
            setIsPreviewLoading(false)
            setIsIframeLoading(true)
            setPreviewError(null)
          } else {
            setIsPreviewLoading(false)
            setIsIframeLoading(false)
            setPreviewError(t('errors.failedToGeneratePreviewUrl'))
          }
        },
        onError: (error) => {
          setIsPreviewLoading(false)
          setIsIframeLoading(false)
          const errorMessage = error instanceof Error ? error.message : t('errors.errorCreatingPreview')
          setPreviewError(errorMessage)
        },
      })
    },
    () => {
      form.trigger('modules')
    }
  )

  const handleCreatePage = form.handleSubmit(
    (data) => {
      let hasContactPathError = false
      data.modules.forEach((module, index) => {
        if (module.moduleId && modules) {
          const selectedModule = modules.find((m) => m.moduleId === module.moduleId)
          if (selectedModule?.moduleType === 2 && !module.contactPath?.trim()) {
            form.setError(`modules.${index}.contactPath`, {
              type: 'required',
              message: t('form.contactPathRequired'),
            })
            hasContactPathError = true
          }
        }
      })

      if (hasContactPathError) {
        return
      }

      setIsPreviewLoading(true)
      setPreviewError(null)
      setIsIframeLoading(true)

      const moduleComponentSettings = mapModulesToComponentSettings(data.modules)

      const request = {
        pageName: data.pageName,
        pageCode: data.pageCode,
        campaignId: Number.parseInt(data.campaign, 10) || 0,
        targetCountryCode: data.country || '',
        languageCode: data.language || '',
        isPreview: false,
        statusId: data.statusId || 0,
        ...(isEditMode && pageId ? { pageId } : {}),
        moduleComponentSettings,
      }

      pageBuilderMutation.mutate(request, {
        onSuccess: (result: CreatePageBuilderResult | undefined) => {
          if (result?.landingPageUrl) {
            setGeneratedResult(result)
            setIsPreviewLoading(false)
            setIsIframeLoading(true)
            setPreviewError(null)
          } else {
            setIsPreviewLoading(false)
            setIsIframeLoading(false)
            setPreviewError(t('errors.failedToGeneratePageUrl'))
          }
        },
        onError: (error) => {
          setIsPreviewLoading(false)
          setIsIframeLoading(false)
          const errorMessage = error instanceof Error ? error.message : (isEditMode ? t('errors.errorUpdatingPage') : t('errors.errorCreatingPage'))
          setPreviewError(errorMessage)
        },
      })
    },
    () => {
      form.trigger('modules')
    }
  )

  const handleReset = () => {
    setDialogOpen('reset')
  }

  return (
    <div className='mb-4 flex gap-1'>
      <Button 
        variant='outline' 
        className='flex-1 gap-0.5 px-1 py-1 text-xs lg:text-sm lg:gap-1 lg:px-1.5 lg:py-1.5' 
        disabled={isDisabled || pageBuilderMutation.isPending || isPreviewLoading}
        onClick={handlePreviewPage}
        type='button'
      >
        <Eye className='h-3 w-3 lg:h-3.5 lg:w-3.5' />
        {isPreviewLoading ? t('form.loading') : t('form.preview')}
      </Button>
      <Button 
        className='flex-1 gap-0.5 bg-gray-900 text-white hover:bg-gray-800 px-1 py-1 text-xs lg:text-sm lg:gap-1 lg:px-1.5 lg:py-1.5' 
        disabled={isDisabled || pageBuilderMutation.isPending || isPreviewLoading}
        onClick={handleCreatePage}
        type='button'
      >
        <FilePlus className='h-3 w-3 lg:h-3.5 lg:w-3.5' />
        {isPreviewLoading || pageBuilderMutation.isPending ? t('form.loading') : isEditMode ? t('form.update') : t('form.create')}
      </Button>
      <Button 
        variant='outline' 
        className='flex-1 gap-0.5 px-1 py-1 text-xs lg:text-sm lg:gap-1 lg:px-1.5 lg:py-1.5' 
        onClick={handleReset}
        type='button'
      >
        <RotateCw className='h-3 w-3 lg:h-3.5 lg:w-3.5' />
        {t('form.reset')}
      </Button>
    </div>
  )
}

