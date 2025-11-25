import { useQuery } from '@tanstack/react-query'
import { linkGeneratorApi } from './client'

export const linkGeneratorKeys = {
  all: ['link-generator'] as const,
  campaigns: () => [...linkGeneratorKeys.all, 'campaigns'] as const,
  countries: () => [...linkGeneratorKeys.all, 'countries'] as const,
  languages: (countryCode: string) =>
    [...linkGeneratorKeys.all, 'languages', countryCode] as const,
  components: (categoryId: number) =>
    [...linkGeneratorKeys.all, 'components', categoryId] as const,
  landingPages: () => [...linkGeneratorKeys.all, 'landing-pages'] as const,
  statusOptions: () => [...linkGeneratorKeys.all, 'status-options'] as const,
  domains: (countryCode: string, domainType: number) =>
    [...linkGeneratorKeys.all, 'domains', countryCode, domainType] as const,
}

export function useGetCampaigns() {
  return useQuery({
    queryKey: linkGeneratorKeys.campaigns(),
    queryFn: () => linkGeneratorApi.getCampaigns(),
    select: (data) => data.data,
  })
}

export function useGetCountries() {
  return useQuery({
    queryKey: linkGeneratorKeys.countries(),
    queryFn: () => linkGeneratorApi.getCountries(),
    select: (data) => data.data,
  })
}

export function useGetLanguages(countryCode: string) {
  return useQuery({
    queryKey: linkGeneratorKeys.languages(countryCode),
    queryFn: () => linkGeneratorApi.getLanguages(countryCode),
    select: (data) => data.data,
    enabled: !!countryCode,
  })
}

export function useGetEvents() {
  return useQuery({
    queryKey: linkGeneratorKeys.components(1),
    queryFn: () => linkGeneratorApi.getEvents(),
    select: (data) => data.data,
  })
}

export function useGetGroups() {
  return useQuery({
    queryKey: linkGeneratorKeys.components(2),
    queryFn: () => linkGeneratorApi.getGroups(),
    select: (data) => data.data,
  })
}

export function useGetChannels() {
  return useQuery({
    queryKey: linkGeneratorKeys.components(3),
    queryFn: () => linkGeneratorApi.getChannels(),
    select: (data) => data.data,
  })
}

export function useGetAgencies() {
  return useQuery({
    queryKey: linkGeneratorKeys.components(4),
    queryFn: () => linkGeneratorApi.getAgencies(),
    select: (data) => data.data,
  })
}

export function useGetTypes() {
  return useQuery({
    queryKey: linkGeneratorKeys.components(5),
    queryFn: () => linkGeneratorApi.getTypes(),
    select: (data) => data.data,
  })
}

export function useGetLandingPages() {
  return useQuery({
    queryKey: linkGeneratorKeys.landingPages(),
    queryFn: () => linkGeneratorApi.getLandingPages(),
    select: (data) => data.data,
  })
}

export function useGetStatusOptions() {
  return useQuery({
    queryKey: linkGeneratorKeys.statusOptions(),
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
    queryKey: linkGeneratorKeys.domains(countryCode, domainType),
    queryFn: () => linkGeneratorApi.getDomains(countryCode, domainType),
    select: (data) => data.data,
    enabled: !!countryCode && domainType != null,
  })
}
