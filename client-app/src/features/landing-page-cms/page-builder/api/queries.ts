import { useQuery } from '@tanstack/react-query'
import { pageBuilderApi } from './client'

export const pageBuilderKeys = {
  all: ['page-builder'] as const,
  campaigns: () => [...pageBuilderKeys.all, 'campaigns'] as const,
  countries: () => [...pageBuilderKeys.all, 'countries'] as const,
  languages: (countryCode: string) => [...pageBuilderKeys.all, 'languages', countryCode] as const,
  components: (categoryId: number) => [...pageBuilderKeys.all, 'components', categoryId] as const,
  landingPages: () => [...pageBuilderKeys.all, 'landing-pages'] as const,
  statusOptions: () => [...pageBuilderKeys.all, 'status-options'] as const,
  domains: (countryCode: string, domainType: number) => [...pageBuilderKeys.all, 'domains', countryCode, domainType] as const,
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

export function useGetEvents() {
  return useQuery({
    queryKey: pageBuilderKeys.components(1),
    queryFn: () => pageBuilderApi.getEvents(),
    select: (data) => data.data,
  })
}

export function useGetGroups() {
  return useQuery({
    queryKey: pageBuilderKeys.components(2),
    queryFn: () => pageBuilderApi.getGroups(),
    select: (data) => data.data,
  })
}

export function useGetChannels() {
  return useQuery({
    queryKey: pageBuilderKeys.components(3),
    queryFn: () => pageBuilderApi.getChannels(),
    select: (data) => data.data,
  })
}

export function useGetAgencies() {
  return useQuery({
    queryKey: pageBuilderKeys.components(4),
    queryFn: () => pageBuilderApi.getAgencies(),
    select: (data) => data.data,
  })
}

export function useGetTypes() {
  return useQuery({
    queryKey: pageBuilderKeys.components(5),
    queryFn: () => pageBuilderApi.getTypes(),
    select: (data) => data.data,
  })
}

export function useGetLandingPages() {
  return useQuery({
    queryKey: pageBuilderKeys.landingPages(),
    queryFn: () => pageBuilderApi.getLandingPages(),
    select: (data) => data.data,
  })
}

export function useGetStatusOptions() {
  return useQuery({
    queryKey: pageBuilderKeys.statusOptions(),
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return {
        errorCode: 0,
        data: [
          { label: 'Active', value: 1 },
          { label: 'Inactive', value: 2 },
        ],
      }
    },
  })
}

export function useGetDomains(countryCode: string, domainType: number) {
  return useQuery({
    queryKey: pageBuilderKeys.domains(countryCode, domainType),
    queryFn: () => pageBuilderApi.getDomains(countryCode, domainType),
    select: (data) => data.data,
    enabled: !!countryCode && domainType != null,
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

