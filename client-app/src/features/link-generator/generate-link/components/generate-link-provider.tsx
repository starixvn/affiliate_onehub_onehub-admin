import React from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  useGetCampaigns,
  useGetCountries,
  useGetLanguages,
  useGetEvents,
  useGetGroups,
  useGetChannels,
  useGetAgencies,
  useGetTypes,
  useGetLandingPages,
} from '../api/queries'
import { generateLinkFormSchema, type GenerateLinkFormValues } from '../data/schema'
import type { CampaignInfo, TargetCountry, Market, ComponentInfo, LandingPageOption, LinkGeneratedResult } from '../types'
import useDialogState from '@/hooks/use-dialog-state'

export type DialogType = 'campaign' | 'group' | 'channel' | 'type' | 'agency' | 'event'

type GenerateLinkContextType = {
  form: UseFormReturn<GenerateLinkFormValues>
  campaigns: CampaignInfo[] | undefined
  countries: TargetCountry[] | undefined
  languages: Market[] | undefined
  events: ComponentInfo[] | undefined
  groups: ComponentInfo[] | undefined
  channels: ComponentInfo[] | undefined
  agencies: ComponentInfo[] | undefined
  types: ComponentInfo[] | undefined
  landingPages: Record<string, LandingPageOption[]> | undefined
  isLoading: boolean
  isError: boolean
  dialogOpen: DialogType | null
  setDialogOpen: (type: DialogType | null) => void
  generatedResult: LinkGeneratedResult | null
  setGeneratedResult: (result: LinkGeneratedResult | null) => void
}

const GenerateLinkContext = React.createContext<GenerateLinkContextType | null>(null)

type GenerateLinkProviderProps = {
  children: React.ReactNode
}

export function GenerateLinkProvider({ children }: GenerateLinkProviderProps) {
  const { data: campaigns, isLoading: isLoadingCampaigns, isError: isErrorCampaigns } = useGetCampaigns()
  const { data: countries, isLoading: isLoadingCountries, isError: isErrorCountries } = useGetCountries()
  const { data: languages, isLoading: isLoadingLanguages, isError: isErrorLanguages } = useGetLanguages()
  const { data: events, isLoading: isLoadingEvents, isError: isErrorEvents } = useGetEvents()
  const { data: groups, isLoading: isLoadingGroups, isError: isErrorGroups } = useGetGroups()
  const { data: channels, isLoading: isLoadingChannels, isError: isErrorChannels } = useGetChannels()
  const { data: agencies, isLoading: isLoadingAgencies, isError: isErrorAgencies } = useGetAgencies()
  const { data: types, isLoading: isLoadingTypes, isError: isErrorTypes } = useGetTypes()
  const { data: landingPages, isLoading: isLoadingLandingPages, isError: isErrorLandingPages } = useGetLandingPages()

  const [dialogOpen, setDialogOpen] = useDialogState<DialogType>(null)
  const [generatedResult, setGeneratedResult] = React.useState<LinkGeneratedResult | null>(null)

  const isLoading =
    isLoadingCampaigns ||
    isLoadingCountries ||
    isLoadingLanguages ||
    isLoadingEvents ||
    isLoadingGroups ||
    isLoadingChannels ||
    isLoadingAgencies ||
    isLoadingTypes ||
    isLoadingLandingPages

  const isError =
    isErrorCampaigns ||
    isErrorCountries ||
    isErrorLanguages ||
    isErrorEvents ||
    isErrorGroups ||
    isErrorChannels ||
    isErrorAgencies ||
    isErrorTypes ||
    isErrorLandingPages

  const form = useForm<GenerateLinkFormValues>({
    resolver: zodResolver(generateLinkFormSchema),
    defaultValues: {
      linkName: '',
      identifierCode: '',
      campaign: '',
      campaignCode: '',
      country: '',
      language: '',
      group: '',
      groupCode: '',
      event: '',
      eventCodes: '',
      domainName: '',
      domainReservedNote: '',
      shortDomain: '',
      shortPath: '',
      channel: '',
      channelCode: '',
      type: '',
      typeCode: '',
      agency: '',
      agencyCode: '',
      landingPage: '',
      pageType: 0,
      pageCode: '',
      note: '',
    },
  })

  return (
    <GenerateLinkContext
      value={{
        form,
        campaigns,
        countries,
        languages,
        events,
        groups,
        channels,
        agencies,
        types,
        landingPages,
        isLoading,
        isError,
        dialogOpen,
        setDialogOpen,
        generatedResult,
        setGeneratedResult,
      }}
    >
      {children}
    </GenerateLinkContext>
  )
}

export const useGenerateLink = () => {
  const context = React.useContext(GenerateLinkContext)

  if (!context) {
    throw new Error('useGenerateLink has to be used within <GenerateLinkProvider>')
  }

  return context
}

