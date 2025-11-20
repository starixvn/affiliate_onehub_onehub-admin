import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  CreateMediaRequest,
  UpdateMediaRequest,
} from '@/features/landing-page-cms/shared'
import { MEDIA_STATUS } from '@/features/landing-page-cms/shared'
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
        toast.success('Registration form created successfully')
      } else {
        onError?.(response.errorMessage || 'Failed to create registration form')
      }
    },
  })
}

export const useUpdateMedia = (onError?: (error: string) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateMediaRequest) =>
      registrationFormManagementApi.updateMedia(data),
    onSuccess: (response) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({
          queryKey: registrationFormManagementKeys.lists(),
        })
        toast.success('Registration form updated successfully')
      } else {
        onError?.(response.errorMessage || 'Failed to update registration form')
      }
    },
  })
}

export const useDeleteMedias = (onError?: (error: string) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (mediaIds: string) =>
      registrationFormManagementApi.deleteMedias(mediaIds),
    onSuccess: (response) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({
          queryKey: registrationFormManagementKeys.lists(),
        })
        toast.success('Registration forms deleted successfully')
      } else {
        const errorMessage =
          response.errorMessage || 'Failed to delete registration forms'
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
      registrationFormManagementApi.updateMediaStatus(ids, statusId),
    onSuccess: (response, { statusId }) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({
          queryKey: registrationFormManagementKeys.lists(),
        })
        toast.success(
          `Registration forms updated to ${statusId === MEDIA_STATUS.ACTIVE ? 'active' : 'inactive'} successfully`
        )
      } else {
        const errorMessage =
          response.errorMessage || 'Failed to update registration forms status'
        onError?.(errorMessage)
        if (!onError) {
          toast.error(errorMessage)
        }
      }
    },
  })
}
