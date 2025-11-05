import { useQuery } from '@tanstack/react-query'
import { linkGeneratorApi } from './client'

export const linkGeneratorKeys = {
  all: ['link-generator'] as const,
  options: () => [...linkGeneratorKeys.all, 'options'] as const,
  statusOptions: () => [...linkGeneratorKeys.all, 'status-options'] as const,
  languages: (countryCode: string) => [...linkGeneratorKeys.all, 'languages', countryCode] as const,
}

export function useGetLinkGeneratorOptions() {
  return useQuery({
    queryKey: linkGeneratorKeys.options(),
    queryFn: () => linkGeneratorApi.getOptions(),
    select: (data) => data.data,
  })
}

export function useGetLanguagesByCountry(countryCode: string) {
  return useQuery({
    queryKey: linkGeneratorKeys.languages(countryCode),
    queryFn: () => linkGeneratorApi.getLanguagesByCountry(countryCode),
    select: (data) => data.data,
    enabled: !!countryCode,
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
          { label: 'Inactive', value: 0 },
        ],
      }
    },
  })
}

