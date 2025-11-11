import { useQuery } from '@tanstack/react-query'
import { EXCLUDE_MODULE_TYPES } from '../data/constants'
import {
  type AssetStatus,
  type Module,
  type GetAssetListRequest,
} from '../types'
import { assetUploaderApi } from './client'

export const assetUploaderKeys = {
  all: ['asset-uploader'] as const,
  lists: () => [...assetUploaderKeys.all, 'list'] as const,
  list: (params?: GetAssetListRequest) =>
    [...assetUploaderKeys.lists(), params] as const,
  filters: () => [...assetUploaderKeys.all, 'filters'] as const,
}

export const useGetAssetList = (params?: GetAssetListRequest) => {
  return useQuery({
    queryKey: assetUploaderKeys.list(params),
    queryFn: () => assetUploaderApi.getAssetList(params as GetAssetListRequest),
    select: (data) => data.data,
  })
}

export const useAssetFilters = () => {
  const query = useQuery({
    queryKey: assetUploaderKeys.filters(),
    queryFn: () => assetUploaderApi.getAssetFilters(),
    select: (data) => {
      const response = data.data
      return {
        modules:
          response?.modules.filter(
            (module: Module) =>
              !EXCLUDE_MODULE_TYPES.includes(
                module.moduleType as (typeof EXCLUDE_MODULE_TYPES)[number]
              )
          ) ?? [],
        countries: response?.targetCountries ?? [],
        languages: response?.languages ?? [],
        assetStatus:
          response?.statusInfos.filter(
            (status: AssetStatus) => status.statusId !== 0
          ) ?? [],
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
