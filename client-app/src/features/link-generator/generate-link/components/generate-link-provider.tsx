import React, { useMemo, useCallback, useEffect, useContext, useState } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation } from '@tanstack/react-router'
import {
  useGetCampaigns,
  useGetCountries,
  useGetEvents,
  useGetGroups,
  useGetChannels,
  useGetAgencies,
  useGetTypes,
  useGetLandingPages,
} from '../api/queries'
import { generateLinkFormSchema, generateLinkDefaultValues, type GenerateLinkFormValues } from '../data/schema'
import type { CampaignInfo, TargetCountry, ComponentInfo, LandingPageOption, LinkGeneratedResult } from '../types'
import type { LinkInfo } from '../../link-management/data/schema'
import useDialogState from '@/hooks/use-dialog-state'

export type DialogType =
  | 'campaign'
  | 'group'
  | 'channel'
  | 'type'
  | 'agency'
  | 'event'

type GenerateLinkContextType = {
  form: UseFormReturn<GenerateLinkFormValues>
  campaigns: CampaignInfo[] | undefined
  countries: TargetCountry[] | undefined
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

const GenerateLinkContext = React.createContext<GenerateLinkContextType | null>(
  null
)

type GenerateLinkProviderProps = {
  children: React.ReactNode
}

export function GenerateLinkProvider({ children }: GenerateLinkProviderProps) {
  const [dialogOpen, setDialogOpen] = useDialogState<DialogType>(null)
  const [generatedResult, setGeneratedResult] =
    useState<LinkGeneratedResult | null>(null)
  const location = useLocation()

  const form = useForm<GenerateLinkFormValues>({
    resolver: zodResolver(generateLinkFormSchema),
    defaultValues: generateLinkDefaultValues,
  })

  const {
    data: campaigns,
    isLoading: isLoadingCampaigns,
    isError: isErrorCampaigns,
  } = useGetCampaigns()
  const {
    data: countries,
    isLoading: isLoadingCountries,
    isError: isErrorCountries,
  } = useGetCountries()
  const {
    data: events,
    isLoading: isLoadingEvents,
    isError: isErrorEvents,
  } = useGetEvents()
  const {
    data: groups,
    isLoading: isLoadingGroups,
    isError: isErrorGroups,
  } = useGetGroups()
  const {
    data: channels,
    isLoading: isLoadingChannels,
    isError: isErrorChannels,
  } = useGetChannels()
  const {
    data: agencies,
    isLoading: isLoadingAgencies,
    isError: isErrorAgencies,
  } = useGetAgencies()
  const {
    data: types,
    isLoading: isLoadingTypes,
    isError: isErrorTypes,
  } = useGetTypes()
  const {
    data: landingPages,
    isLoading: isLoadingLandingPages,
    isError: isErrorLandingPages,
  } = useGetLandingPages()

  const isLoading =
    isLoadingCampaigns ||
    isLoadingCountries ||
    isLoadingEvents ||
    isLoadingGroups ||
    isLoadingChannels ||
    isLoadingAgencies ||
    isLoadingTypes ||
    isLoadingLandingPages

  const isError =
    isErrorCampaigns ||
    isErrorCountries ||
    isErrorEvents ||
    isErrorGroups ||
    isErrorChannels ||
    isErrorAgencies ||
    isErrorTypes ||
    isErrorLandingPages

  const mapLinkInfoToFormValues = useCallback((linkInfo: LinkInfo): Partial<GenerateLinkFormValues> => {
    const formValues: Partial<GenerateLinkFormValues> = {
      linkName: linkInfo.linkName,
      identifierCode: linkInfo.idCode,
      note: linkInfo.note,
    }

    if (campaigns && linkInfo.campaignName) {
      const campaign = campaigns.find(c => c.campaignName === linkInfo.campaignName)
      if (campaign) {
        formValues.campaign = String(campaign.campaignId)
        formValues.campaignCode = campaign.campaignCode
      }
    }

    if (countries && linkInfo.countryName) {
      const country = countries.find(c => c.targetCountryName === linkInfo.countryName)
      if (country) {
        formValues.country = country.targetCountryCode
        formValues.language = country.languageCode || ''
        formValues.shortedLanguageCode = country.targetLanguageCode || ''
      }
    }

    if (groups && linkInfo.group) {
      const group = groups.find(g => g.componentName === linkInfo.group)
      if (group) {
        formValues.group = String(group.componentId)
        formValues.groupCode = group.componentCode
      }
    }

    if (events && linkInfo.event) {
      const eventNames = linkInfo.event.split(',').map(name => name.trim()).filter(Boolean)
      const matchingEvents = events.filter(e => eventNames.includes(e.componentName))

      if (matchingEvents.length > 0) {
        formValues.event = matchingEvents.map(e => String(e.componentId)).join(',')
        formValues.eventCodes = matchingEvents.map(e => e.componentCode).join(',')
      }
    }

    if (channels && linkInfo.channelName) {
      const channel = channels.find(c => c.componentName === linkInfo.channelName)
      if (channel) {
        formValues.channel = String(channel.componentId)
        formValues.channelCode = channel.componentCode
      }
    }

    if (types && linkInfo.type) {
      const type = types.find(t => t.componentName === linkInfo.type)
      if (type) {
        formValues.type = String(type.componentId)
        formValues.typeCode = type.componentCode
      }
    }

    if (agencies && linkInfo.agency) {
      const agency = agencies.find(a => a.componentName === linkInfo.agency)
      if (agency) {
        formValues.agency = String(agency.componentId)
        formValues.agencyCode = agency.componentCode
      }
    }

    if (linkInfo.landingPage) {
      formValues.landingPage = linkInfo.landingPage
    }

    if (linkInfo.shortLink) {
      try {
        const url = new URL(linkInfo.shortLink)
        formValues.shortDomain = url.origin
        formValues.shortPath = url.pathname.substring(1)
      } catch (_error) {
        const parts = linkInfo.shortLink.split('/')
        if (parts.length >= 3) {
          formValues.shortDomain = `${parts[0]}//${parts[2]}`
          formValues.shortPath = parts.slice(3).join('/')
        }
      }
    }

    if (linkInfo.domainName) {
      formValues.domainName = linkInfo.domainName
      formValues.domainReservedNote = `Reserved for ${linkInfo.linkName}`
    }

    return formValues
  }, [campaigns, countries, events, groups, channels, types, agencies])

  useEffect(() => {
    const state = location.state as { duplicateLink?: LinkInfo } | null
    if (state?.duplicateLink && !isLoading) {
      const formValues = mapLinkInfoToFormValues(state.duplicateLink)
      form.reset({
        ...generateLinkDefaultValues,
        ...formValues,
      })
    }
  }, [location.state, form, isLoading, campaigns, countries, events, groups, channels, agencies, types, mapLinkInfoToFormValues])

  const contextValue = useMemo(
    () => ({
      form,
      campaigns,
      countries,
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
    }),
    [
      form,
      campaigns,
      countries,
      events,
      groups,
      channels,
      agencies,
      types,
      landingPages,
      isLoading,
      isError,
      dialogOpen,
      generatedResult,
      setDialogOpen,
      setGeneratedResult,
    ]
  )

  return (
    <GenerateLinkContext value={contextValue}>{children}</GenerateLinkContext>
  )
}

export const useGenerateLink = () => {
  const context = useContext(GenerateLinkContext)

  if (!context) {
    throw new Error(
      'useGenerateLink has to be used within <GenerateLinkProvider>'
    )
  }

  return context
}
