import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  CreateMediaRequest,
  UpdateMediaRequest,
  UpdateMediaStatusResponse,
} from '@/features/landing-page-cms/shared'
import { MEDIA_STATUS } from '@/features/landing-page-cms/shared'
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
    mutationFn: (data: UpdateMediaRequest) =>
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

export const useDeleteMedias = (onError?: (error: string) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (mediaIds: string) => assetUploaderApi.deleteMedias(mediaIds),
    onSuccess: (response) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({ queryKey: assetUploaderKeys.lists() })
        toast.success('Assets deleted successfully')
      } else {
        const errorMessage = response.errorMessage || 'Failed to delete assets'
        onError?.(errorMessage)
        if (!onError) {
          toast.error(errorMessage)
        }
      }
    },
  })
}

export const useUpdateMediaStatus = (onError?: (error: string) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ ids, statusId }: { ids: string; statusId: number }) =>
      assetUploaderApi.updateMediaStatus(ids, statusId),
    onSuccess: (response: UpdateMediaStatusResponse, { statusId }) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({ queryKey: assetUploaderKeys.lists() })
        toast.success(
          `Assets updated to ${statusId === MEDIA_STATUS.ACTIVE ? 'active' : 'inactive'} successfully`
        )
      } else {
        const errorMessage =
          response.errorMessage || 'Failed to update assets status'
        onError?.(errorMessage)
        if (!onError) {
          toast.error(errorMessage)
        }
      }
    },
  })
}
