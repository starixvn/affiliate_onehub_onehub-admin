import { useQuery } from '@tanstack/react-query'
import type { GetMediaListRequest } from '@/features/landing-page-cms/shared'
import { registrationFormManagementApi } from './client'

export const registrationFormManagementKeys = {
  all: ['register-form-management'] as const,
  lists: () => [...registrationFormManagementKeys.all, 'list'] as const,
  list: (params?: GetMediaListRequest) =>
    [...registrationFormManagementKeys.lists(), params] as const,
  filters: () => [...registrationFormManagementKeys.all, 'filters'] as const,
}

export const useGetMediaList = (params?: GetMediaListRequest) => {
  return useQuery({
    queryKey: registrationFormManagementKeys.list(params),
    queryFn: () =>
      registrationFormManagementApi.getMediaList(params as GetMediaListRequest),
    select: (data) => data.data,
    enabled: !!params,
  })
}

export const useMediaFilters = () => {
  const query = useQuery({
    queryKey: registrationFormManagementKeys.filters(),
    queryFn: () => registrationFormManagementApi.getMediaFilters(),
    select: (data) => {
      const response = data.data
      return {
        modules: response?.modules ?? [],
        countries: response?.targetCountries ?? [],
        languages: response?.languages ?? [],
        mediaStatus: (response?.statusInfos ?? []).filter(
          (status) => status.statusId !== 0
        ),
        landingPageUrl: response?.landingPageUrl ?? '',
        bannerRootUrl: response?.bannerRootUrl ?? '',
        maximumFiles: response?.maximumFiles ?? 50,
        maxFileSize: response?.maxFileSize ?? 3,
        allowedExtensions: response?.allowedExtensions ?? [],
      }
    },
  })

  return {
    modules: query.data?.modules ?? [],
    countries: query.data?.countries ?? [],
    languages: query.data?.languages ?? [],
    mediaStatus: query.data?.mediaStatus ?? [],
    landingPageUrl: query.data?.landingPageUrl ?? '',
    bannerRootUrl: query.data?.bannerRootUrl ?? '',
    maximumFiles: query.data?.maximumFiles ?? 50,
    maxFileSize: query.data?.maxFileSize ?? 3,
    allowedExtensions: query.data?.allowedExtensions ?? [],
    isLoading: query.isLoading,
    error: query.error,
  }
}
