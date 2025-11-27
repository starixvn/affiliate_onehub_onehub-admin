import { useQuery } from '@tanstack/react-query'
import { pageBuilderApi } from './client'

export const pageBuilderKeys = {
  all: ['page-builder'] as const,
  campaigns: () => [...pageBuilderKeys.all, 'campaigns'] as const,
  countries: () => [...pageBuilderKeys.all, 'countries'] as const,
  languages: (countryCode: string) => [...pageBuilderKeys.all, 'languages', countryCode] as const,
  modules: (moduleId: number) => [...pageBuilderKeys.all, 'modules', moduleId] as const,
  mediaSources: (languageCode: string, targetCountryCode: string, moduleId?: number) => [...pageBuilderKeys.all, 'media-sources', languageCode, targetCountryCode, moduleId ?? 'all'] as const,
}

export function useGetCampaigns() {
  return useQuery({
    queryKey: pageBuilderKeys.campaigns(),
    queryFn: () => pageBuilderApi.getCampaigns(),
    select: (data) => data.data,
  })
}

export function useGetCountries() {
  return useQuery({
    queryKey: pageBuilderKeys.countries(),
    queryFn: () => pageBuilderApi.getCountries(),
    select: (data) => data.data,
  })
}

export function useGetLanguages(countryCode: string) {
  return useQuery({
    queryKey: pageBuilderKeys.languages(countryCode),
    queryFn: () => pageBuilderApi.getLanguages(countryCode),
    select: (data) => data.data,
    enabled: !!countryCode,
  })
}

export function useGetModules(moduleId?: number) {
  return useQuery({
    queryKey: pageBuilderKeys.modules(moduleId ?? 0),
    queryFn: () => pageBuilderApi.getModules(moduleId),
    select: (data) => data.data,
  })
}

export function useGetMediaSources(languageCode: string, targetCountryCode: string, moduleId?: number) {
  return useQuery({
    queryKey: pageBuilderKeys.mediaSources(languageCode, targetCountryCode, moduleId),
    queryFn: () => pageBuilderApi.getMediaSources(languageCode, targetCountryCode, moduleId),
    select: (data) => data.data,
    enabled: !!languageCode && !!targetCountryCode && !!moduleId,
  })
}

export function useGetPageBuilderDetails(pageId: number | undefined, isPreview: boolean) {
  return useQuery({
    queryKey: [...pageBuilderKeys.all, 'page-details', pageId, isPreview] as const,
    queryFn: () => pageBuilderApi.getPageBuilderDetails(pageId!, isPreview),
    select: (data) => data.data,
    enabled: !!pageId,
  })
}

