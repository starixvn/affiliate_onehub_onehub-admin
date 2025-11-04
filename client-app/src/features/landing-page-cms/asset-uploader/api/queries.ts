import { useQuery } from '@tanstack/react-query'
import { type GetAssetListRequest } from '../types'
import { assetUploaderApi } from './client'
import { EXCLUDE_MODULE_TYPES } from '../data/constants'

export const assetUploaderKeys = {
  all: ['asset-uploader'] as const,
  lists: () => [...assetUploaderKeys.all, 'list'] as const,
  list: (params?: GetAssetListRequest) =>
    [...assetUploaderKeys.lists(), params] as const,
  details: () => [...assetUploaderKeys.all, 'detail'] as const,
  detail: (mediaId: number) =>
    [...assetUploaderKeys.details(), mediaId] as const,
  filters: () => [...assetUploaderKeys.all, 'filters'] as const,
}

export const useGetAssetList = (params?: GetAssetListRequest) => {
  return useQuery({
    queryKey: assetUploaderKeys.list(params),
    queryFn: () => assetUploaderApi.getAssetList(params as GetAssetListRequest),
    select: (data) => data.result,
  })
}

export const useGetAssetDetail = (mediaId: number) => {
  return useQuery({
    queryKey: assetUploaderKeys.detail(mediaId),
    queryFn: () => assetUploaderApi.getAssetDetail(mediaId),
    select: (data) => data.result,
  })
}

export const useAssetFilters = (params?: GetAssetListRequest) => {
  const query = useQuery({
    queryKey: assetUploaderKeys.filters(),
    queryFn: () =>
      assetUploaderApi.getAssetFilters(params ?? ({} as GetAssetListRequest)),
    select: (data) => {
      return {
        modules: data?.moduleList.filter((module) => !EXCLUDE_MODULE_TYPES.includes(module.moduleType as (typeof EXCLUDE_MODULE_TYPES)[number])) ?? [],
        countries: data?.targetCountryList ?? [],
        languages: data?.allLanguagesInSystem ?? [],
        assetStatus:
          data?.statusList.filter((status) => status.statusId !== 0) ?? [],
        landingPageUrl: data?.landingPageUrl ?? '',
        bannerRootUrl: data?.bannerRootUrl ?? '',
        maximumFiles: data?.maximumFiles ?? 50,
        maxFileSize: data?.maxFileSize ?? 3,
        allowedExtensions: data?.allowedExtensions ?? [],
      }
    },
  })

  return {
    ...query.data,
    isLoading: query.isLoading,
    error: query.error,
  }
}
