import React from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import {
  useGetCampaigns,
  useGetCountries,
  useGetLanguages,
  useGetPageBuilderDetails,
  useGetModules,
  pageBuilderKeys,
} from '../api/queries'
import { createPageBuilderFormSchema, pageBuilderDefaultValues, type PageBuilderFormValues } from '../data/schema'
import { useTranslation } from 'react-i18next'
import type { CampaignInfo, TargetCountry, CreatePageBuilderResult } from '../types'
import useDialogState from '@/hooks/use-dialog-state'

export type DialogType = 'campaign' | 'group' | 'channel' | 'type' | 'agency' | 'event' | 'reset'

type PageBuilderContextType = {
  form: UseFormReturn<PageBuilderFormValues>
  campaigns: CampaignInfo[] | undefined
  countries: TargetCountry[] | undefined
  isLoading: boolean
  isError: boolean
  dialogOpen: DialogType | null
  setDialogOpen: (type: DialogType | null) => void
  generatedResult: CreatePageBuilderResult | null
  setGeneratedResult: (result: CreatePageBuilderResult | null) => void
  isPreviewLoading: boolean
  setIsPreviewLoading: (loading: boolean) => void
  isIframeLoading: boolean
  setIsIframeLoading: (loading: boolean) => void
  previewError: string | null
  setPreviewError: (error: string | null) => void
  pageId: number | undefined
  resetToInitialData: () => void
}

const PageBuilderContext = React.createContext<PageBuilderContextType | null>(null)

type PageBuilderProviderProps = {
  children: React.ReactNode
  pageId?: number
  isPreview?: boolean
}

export function PageBuilderProvider({ children, pageId, isPreview = false }: PageBuilderProviderProps) {
  const { t } = useTranslation('page-builder')
  const [dialogOpen, setDialogOpen] = useDialogState<DialogType>(null)
  const [generatedResult, setGeneratedResult] = React.useState<CreatePageBuilderResult | null>(null)
  const [isDataLoaded, setIsDataLoaded] = React.useState(false)
  const [isPreviewLoading, setIsPreviewLoading] = React.useState(false)
  const [isIframeLoading, setIsIframeLoading] = React.useState(false)
  const [previewError, setPreviewError] = React.useState<string | null>(null)
  const queryClient = useQueryClient()

  const form = useForm<PageBuilderFormValues>({
    resolver: zodResolver(createPageBuilderFormSchema(t)),
    defaultValues: pageBuilderDefaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  const { data: campaigns, isLoading: isLoadingCampaigns, isError: isErrorCampaigns } = useGetCampaigns()
  const { data: countries, isLoading: isLoadingCountries, isError: isErrorCountries } = useGetCountries()
  const { data: pageDetails, isLoading: isLoadingPageDetails } = useGetPageBuilderDetails(pageId, isPreview)
  const { data: modules } = useGetModules()

  const countryCode = form.watch('country')
  const { data: languages, isLoading: isLoadingLanguages } = useGetLanguages(countryCode || '')

  React.useEffect(() => {
    if (pageDetails && !isDataLoaded && campaigns && countries && modules) {
      const campaign = campaigns.find((c) => c.campaignId === pageDetails.campaignId)
      const country = countries.find((c) => c.targetCountryCode === pageDetails.targetCountryCode)

      if (campaign && country) {
        if (!countryCode || countryCode !== pageDetails.targetCountryCode) {
          form.setValue('country', pageDetails.targetCountryCode, { shouldValidate: false })
          return
        }

        if (isLoadingLanguages) {
          return
        }

        const countryLanguages = languages || []
        let language = countryLanguages.find((l) => l.languageCode === pageDetails.languageCode)
        
        if (!language && countryLanguages.length > 0) {
          language = countryLanguages[0]
        }

        // Group items by moduleId and orderId
        type ModuleComponentItemType = NonNullable<typeof pageDetails.moduleComponentSettings>[0]
        const groupedItems = new Map<string, ModuleComponentItemType[]>()
        
        pageDetails.moduleComponentSettings?.forEach((item) => {
          const key = `${item.moduleId}-${item.orderId}`
          const existing = groupedItems.get(key)
          if (existing) {
            existing.push(item)
          } else {
            groupedItems.set(key, [item])
          }
        })

        const mappedModules = Array.from(groupedItems.values()).map((items) => {
          if (items.length === 0) {
            return { moduleId: undefined, sourceId: undefined, contactPath: undefined }
          }

          const firstItem = items[0]
          const module = modules.find((m) => m.moduleId === firstItem.moduleId)
          const moduleType = module?.moduleType
          const isMultipleUpload = module?.isMultipleUpload ?? false

          let sourceId: string | undefined
          let contactPath: string | undefined

          if (moduleType === 2) {
            // Contact Us: use extraInfo for contactPath, mediaId for sourceId
            contactPath = firstItem.extraInfo || undefined
            if (isMultipleUpload && items.length > 1) {
              // Multiple select: merge all mediaIds
              const mediaIds = items
                .map((item) => item.mediaId)
                .filter((id): id is number => id !== null && id !== undefined)
                .map(String)
              sourceId = mediaIds.length > 0 ? mediaIds.join(',') : undefined
            } else {
              sourceId = firstItem.mediaId ? String(firstItem.mediaId) : undefined
            }
          } else if (moduleType === 4) {
            // Youtube: use extraInfo for sourceId (URL)
            sourceId = firstItem.extraInfo || undefined
          } else {
            // Regular modules: use mediaId for sourceId
            if (isMultipleUpload && items.length > 1) {
              // Multiple select: merge all mediaIds
              const mediaIds = items
                .map((item) => item.mediaId)
                .filter((id): id is number => id !== null && id !== undefined)
                .map(String)
              sourceId = mediaIds.length > 0 ? mediaIds.join(',') : undefined
            } else {
              sourceId = firstItem.mediaId ? String(firstItem.mediaId) : undefined
            }
          }

          return {
            moduleId: firstItem.moduleId,
            sourceId,
            contactPath,
          }
        })

        const finalModules = mappedModules.length > 0 
          ? mappedModules 
          : [{ moduleId: undefined, sourceId: undefined, contactPath: undefined }]

        form.reset({
          pageName: pageDetails.pageName,
          pageCode: pageDetails.pageCode,
          campaign: String(pageDetails.campaignId),
          campaignCode: campaign.campaignCode,
          country: pageDetails.targetCountryCode,
          language: language?.languageCode || pageDetails.languageCode || '',
          shortedLanguageCode: language?.shortedLanguageCode || '',
          statusId: pageDetails.statusId,
          modules: finalModules,
        })

        setIsDataLoaded(true)
      }
    }
  }, [pageDetails, isDataLoaded, campaigns, countries, languages, modules, form, countryCode, isLoadingLanguages])

  const isLoading =
    isLoadingCampaigns ||
    isLoadingCountries ||
    (!!pageId && isLoadingPageDetails)

  const isError =
    isErrorCampaigns ||
    isErrorCountries 

  const resetToInitialData = React.useCallback(() => {
    if (pageId) {
      setIsDataLoaded(false)
      queryClient.invalidateQueries({
        queryKey: [...pageBuilderKeys.all, 'page-details', pageId, isPreview],
      })
    }
  }, [pageId, isPreview, queryClient])

  const contextValue = React.useMemo(
    () => ({
      form,
      campaigns,
      countries,
      isLoading,
      isError,
      dialogOpen,
      setDialogOpen,
      generatedResult,
      setGeneratedResult,
      isPreviewLoading,
      setIsPreviewLoading,
      isIframeLoading,
      setIsIframeLoading,
      previewError,
      setPreviewError,
      pageId,
      resetToInitialData,
    }),
    [
      form,
      campaigns,
      countries,
      isLoading,
      isError,
      dialogOpen,
      generatedResult,
      isPreviewLoading,
      isIframeLoading,
      previewError,
      pageId,
      resetToInitialData,
      setDialogOpen,
      setGeneratedResult,
      setIsPreviewLoading,
      setIsIframeLoading,
      setPreviewError,
    ]
  )

  return (
    <PageBuilderContext value={contextValue}>
      {children}
    </PageBuilderContext>
  )
}

export const usePageBuilder = () => {
  const context = React.useContext(PageBuilderContext)

  if (!context) {
    throw new Error('usePageBuilder has to be used within <PageBuilderProvider>')
  }

  return context
}

