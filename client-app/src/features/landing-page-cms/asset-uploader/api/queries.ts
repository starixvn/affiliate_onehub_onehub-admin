import { useQuery } from '@tanstack/react-query'
import {
  type MediaStatus,
  type Module,
  type GetMediaListRequest,
} from '@/features/landing-page-cms/shared'
import { assetUploaderApi } from './client'

const EXCLUDE_MODULE_TYPES = [3, 4]

export const assetUploaderKeys = {
  all: ['asset-uploader'] as const,
  lists: () => [...assetUploaderKeys.all, 'list'] as const,
  list: (params?: GetMediaListRequest) =>
    [...assetUploaderKeys.lists(), params] as const,
  filters: () => [...assetUploaderKeys.all, 'filters'] as const,
}

export const useGetMediaList = (params?: GetMediaListRequest) => {
  return useQuery({
    queryKey: assetUploaderKeys.list(params),
    queryFn: () => assetUploaderApi.getMediaList(params!),
    select: (data) => data.data,
    enabled: !!params,
  })
}

export const useMediaFilters = () => {
  const query = useQuery({
    queryKey: assetUploaderKeys.filters(),
    queryFn: () => assetUploaderApi.getMediaFilters(),
    select: (data) => {
      const response = data.data
      return {
        modules:
          response?.modules.filter(
            (module: Module) =>
              !EXCLUDE_MODULE_TYPES.includes(module.moduleType)
          ) ?? [],
        countries: response?.targetCountries ?? [],
        languages: response?.languages ?? [],
        mediaStatus:
          response?.statusInfos.filter(
            (status: MediaStatus) => status.statusId !== 0
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
