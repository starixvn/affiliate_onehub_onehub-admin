import { useQuery } from '@tanstack/react-query'
import type { GetRegisterFormListRequest } from '../types'
import { registerFormManagementApi } from './client'

export const registerFormManagementKeys = {
  all: ['register-form-management'] as const,
  lists: () => [...registerFormManagementKeys.all, 'list'] as const,
  list: (params?: GetRegisterFormListRequest) =>
    [...registerFormManagementKeys.lists(), params] as const,
  details: () => [...registerFormManagementKeys.all, 'detail'] as const,
  detail: (mediaId: number) =>
    [...registerFormManagementKeys.details(), mediaId] as const,
  filters: () => [...registerFormManagementKeys.all, 'filters'] as const,
}

export const useGetRegisterFormList = (params?: GetRegisterFormListRequest) => {
  return useQuery({
    queryKey: registerFormManagementKeys.list(params),
    queryFn: () => registerFormManagementApi.getRegisterFormList(params as GetRegisterFormListRequest),
    select: (data) => data.data,
  })
}

export const useGetRegisterFormDetail = (mediaId: number) => {
  return useQuery({
    queryKey: registerFormManagementKeys.detail(mediaId),
    queryFn: () => registerFormManagementApi.getRegisterFormDetail(mediaId),
    select: (data) => data.data,
  })
}

export const useRegisterFormFilters = () => {
  const query = useQuery({
    queryKey: registerFormManagementKeys.filters(),
    queryFn: () =>
      registerFormManagementApi.getRegisterFormFilters(),
    select: (data) => {
      const response = data.data;
      return {
        modules:
          response?.modules.filter(
            (module) => module.moduleName.toLowerCase().includes('registration form')
          ) ?? [],
        countries: response?.targetCountries ?? [],
        languages: response?.languages ?? [],
        registerFormStatus:
          response?.statusInfos.filter((status) => status.statusId !== 0) ?? [],
        landingPageUrl: response?.landingPageUrl ?? '',
        bannerRootUrl: response?.bannerRootUrl ?? '',
        maximumFiles: response?.maximumFiles ?? 50,
        maxFileSize: response?.maxFileSize ?? 3,
        allowedExtensions: response?.allowedExtensions ?? [],
      }
    },
  })

  return {
    ...query.data,
    isLoading: query.isLoading,
    error: query.error,
  }
}
