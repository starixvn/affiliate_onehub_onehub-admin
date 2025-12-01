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
  internalPageId: number | undefined
  setInternalPageId: (pageId: number | undefined) => void
  isCloneMode: boolean
  resetToInitialData: () => void
  skipDataReloadOnPageIdChange: () => void
}

const PageBuilderContext = React.createContext<PageBuilderContextType | null>(null)

type PageBuilderProviderProps = {
  children: React.ReactNode
  pageId?: number
  isPreview?: boolean
  mode?: string
}

export function PageBuilderProvider({ children, pageId, isPreview = false, mode }: PageBuilderProviderProps) {
  const { t } = useTranslation('page-builder')
  const [dialogOpen, setDialogOpen] = useDialogState<DialogType>(null)
  const [generatedResult, setGeneratedResult] = React.useState<CreatePageBuilderResult | null>(null)
  const [isDataLoaded, setIsDataLoaded] = React.useState(false)
  const [isPreviewLoading, setIsPreviewLoading] = React.useState(false)
  const [isIframeLoading, setIsIframeLoading] = React.useState(false)
  const [previewError, setPreviewError] = React.useState<string | null>(null)
  const [internalPageId, setInternalPageId] = React.useState<number | undefined>(undefined)
  const queryClient = useQueryClient()
  const previousPageIdRef = React.useRef<number | undefined>(pageId)
  const skipDataReloadRef = React.useRef(false)

  const form = useForm<PageBuilderFormValues>({
    resolver: zodResolver(createPageBuilderFormSchema(t)),
    defaultValues: pageBuilderDefaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  const { data: campaigns, isLoading: isLoadingCampaigns, isError: isErrorCampaigns } = useGetCampaigns()
  const { data: countries, isLoading: isLoadingCountries, isError: isErrorCountries } = useGetCountries()
  
  const sortedCountries = React.useMemo(() => {
    if (!countries) return undefined
    return [...countries].sort((a, b) => 
      a.targetCountryName.localeCompare(b.targetCountryName)
    )
  }, [countries])
  
  // Only fetch page details if we have pageId from URL and no internalPageId (not just created)
  const shouldFetchPageDetails = !!pageId && !internalPageId
  const { data: pageDetails, isLoading: isLoadingPageDetails } = useGetPageBuilderDetails(
    shouldFetchPageDetails ? pageId : undefined,
    isPreview
  )
  const { data: modules } = useGetModules()

  const countryCode = form.watch('country')
  const { data: languages, isLoading: isLoadingLanguages } = useGetLanguages(countryCode || '')

  // Reset isDataLoaded when pageId changes, but skip if transitioning from create to edit
  React.useEffect(() => {
    // If skipDataReloadRef is set, it means we're transitioning from create to edit
    // Don't reset isDataLoaded to avoid reloading data
    if (skipDataReloadRef.current) {
      skipDataReloadRef.current = false
      previousPageIdRef.current = pageId
      return
    }
    
    // Only reset if pageId actually changed (not just from undefined to a value after create)
    if (previousPageIdRef.current !== pageId) {
      setIsDataLoaded(false)
      previousPageIdRef.current = pageId
    }
  }, [pageId])

  React.useEffect(() => {
    if (pageDetails && !isDataLoaded && campaigns && sortedCountries && modules) {
      const campaign = campaigns.find((c) => c.campaignId === pageDetails.campaignId)
      const country = sortedCountries.find((c) => c.targetCountryCode === pageDetails.targetCountryCode)

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
  }, [pageDetails, isDataLoaded, campaigns, sortedCountries, languages, modules, form, countryCode, isLoadingLanguages])

  const isLoading =
    isLoadingCampaigns ||
    isLoadingCountries ||
    (shouldFetchPageDetails && isLoadingPageDetails)

  const isError =
    isErrorCampaigns ||
    isErrorCountries 

  // isCloneMode should be false if we have internalPageId (just created)
  const isCloneMode = mode === 'clone' && !internalPageId

  const resetToInitialData = React.useCallback(() => {
    if (pageId) {
      setIsDataLoaded(false)
      queryClient.invalidateQueries({
        queryKey: [...pageBuilderKeys.all, 'page-details', pageId, isPreview],
      })
    }
  }, [pageId, isPreview, queryClient])

  const skipDataReloadOnPageIdChange = React.useCallback(() => {
    skipDataReloadRef.current = true
  }, [])

  const contextValue = React.useMemo(
    () => ({
      form,
      campaigns,
      countries: sortedCountries,
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
      internalPageId,
      setInternalPageId,
      isCloneMode,
      resetToInitialData,
      skipDataReloadOnPageIdChange,
    }),
    [
      form,
      campaigns,
      sortedCountries,
      isLoading,
      isError,
      dialogOpen,
      generatedResult,
      isPreviewLoading,
      isIframeLoading,
      previewError,
      pageId,
      internalPageId,
      isCloneMode,
      resetToInitialData,
      skipDataReloadOnPageIdChange,
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

