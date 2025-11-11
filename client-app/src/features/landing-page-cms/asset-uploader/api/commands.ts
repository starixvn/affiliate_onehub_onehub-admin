import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { CreateAssetRequest, UpdateAssetRequest } from '../types'
import { assetUploaderApi } from './client'
import { assetUploaderKeys } from './queries'

export const useCreateAsset = (onError?: (error: string) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAssetRequest) =>
      assetUploaderApi.createAsset(data),
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

export const useUpdateAsset = (onError?: (error: string) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ data }: { data: UpdateAssetRequest }) =>
      assetUploaderApi.updateAsset(data),
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

export const useDeleteAsset = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (mediaIds: string) => assetUploaderApi.deleteAsset(mediaIds),
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

export const useDeleteAssets = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (mediaIds: string) => assetUploaderApi.deleteAssets(mediaIds),
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

export const useUpdateAssetsStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ ids, statusId }: { ids: string; statusId: number }) =>
      assetUploaderApi.updateAssetsStatus(ids, statusId),
    onSuccess: (response, { statusId }) => {
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
