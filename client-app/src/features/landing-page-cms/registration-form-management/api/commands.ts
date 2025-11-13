import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  CreateMediaRequest,
  UpdateMediaRequest,
} from '@/features/landing-page-cms/shared'
import { registrationFormManagementApi } from './client'
import { registrationFormManagementKeys } from './queries'

export const useCreateMedia = (onError?: (error: string) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateMediaRequest) =>
      registrationFormManagementApi.createMedia(data),
    onSuccess: (response) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({
          queryKey: registrationFormManagementKeys.lists(),
        })
        toast.success('Register form created successfully')
      } else {
        onError?.(response.errorMessage || 'Failed to create register form')
      }
    },
  })
}

export const useUpdateMedia = (onError?: (error: string) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ data }: { data: UpdateMediaRequest }) =>
      registrationFormManagementApi.updateMedia(data),
    onSuccess: (response) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({
          queryKey: registrationFormManagementKeys.lists(),
        })
        toast.success('Register form updated successfully')
      } else {
        onError?.(response.errorMessage || 'Failed to update register form')
      }
    },
  })
}

export const useDeleteMedia = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (mediaIds: string) =>
      registrationFormManagementApi.deleteMedia(mediaIds),
    onSuccess: (response) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({
          queryKey: registrationFormManagementKeys.lists(),
        })
        toast.success('Register form deleted successfully')
      } else {
        toast.error(response.errorMessage || 'Failed to delete register form')
      }
    },
  })
}

export const useDeleteMedias = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (mediaIds: string) =>
      registrationFormManagementApi.deleteMedias(mediaIds),
    onSuccess: (response) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({
          queryKey: registrationFormManagementKeys.lists(),
        })
        toast.success('Register forms deleted successfully')
      } else {
        toast.error(response.errorMessage || 'Failed to delete register forms')
      }
    },
  })
}

export const useUpdateMediaStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ ids, statusId }: { ids: string; statusId: number }) =>
      registrationFormManagementApi.updateMediaStatus(ids, statusId),
    onSuccess: (response, { statusId }) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({
          queryKey: registrationFormManagementKeys.lists(),
        })
        toast.success(
          `Register forms updated to ${statusId === 1 ? 'active' : 'inactive'} successfully`
        )
      } else {
        toast.error(
          response.errorMessage || 'Failed to update register forms status'
        )
      }
    },
  })
}
