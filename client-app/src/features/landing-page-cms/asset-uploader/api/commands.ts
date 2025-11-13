import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  CreateMediaRequest,
  UpdateMediaRequest,
  UpdateMediaStatusResponse,
} from '@/features/landing-page-cms/shared'
import { assetUploaderApi } from './client'
import { assetUploaderKeys } from './queries'

export const useCreateMedia = (onError?: (error: string) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateMediaRequest) =>
      assetUploaderApi.createMedia(data),
    onSuccess: (response) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({ queryKey: assetUploaderKeys.lists() })
        toast.success('Asset created successfully')
      } else {
        onError?.(response.errorMessage || 'Failed to create asset')
      }
    },
  })
}

export const useUpdateMedia = (onError?: (error: string) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ data }: { data: UpdateMediaRequest }) =>
      assetUploaderApi.updateMedia(data),
    onSuccess: (response) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({ queryKey: assetUploaderKeys.lists() })
        toast.success('Asset updated successfully')
      } else {
        onError?.(response.errorMessage || 'Failed to update asset')
      }
    },
  })
}

export const useDeleteMedia = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (mediaIds: string) => assetUploaderApi.deleteMedia(mediaIds),
    onSuccess: (response) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({ queryKey: assetUploaderKeys.lists() })
        toast.success('Asset deleted successfully')
      } else {
        toast.error(response.errorMessage || 'Failed to delete asset')
      }
    },
  })
}

export const useDeleteMedias = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (mediaIds: string) => assetUploaderApi.deleteMedias(mediaIds),
    onSuccess: (response) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({ queryKey: assetUploaderKeys.lists() })
        toast.success('Assets deleted successfully')
      } else {
        toast.error(response.errorMessage || 'Failed to delete assets')
      }
    },
  })
}

export const useUpdateMediaStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ ids, statusId }: { ids: string; statusId: number }) =>
      assetUploaderApi.updateMediaStatus(ids, statusId),
    onSuccess: (response: UpdateMediaStatusResponse, { statusId }) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({ queryKey: assetUploaderKeys.lists() })
        toast.success(
          `Assets updated to ${statusId === 1 ? 'active' : 'inactive'} successfully`
        )
      } else {
        toast.error(response.errorMessage || 'Failed to update assets status')
      }
    },
  })
}
