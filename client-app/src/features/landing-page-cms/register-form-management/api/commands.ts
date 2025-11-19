import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { CreateRegisterFormRequest, UpdateRegisterFormRequest } from '../types'
import { registerFormManagementApi } from './client'
import { registerFormManagementKeys } from './queries'

export const useCreateRegisterForm = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateRegisterFormRequest) =>
      registerFormManagementApi.createRegisterForm(data),
    onSuccess: (response) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({ queryKey: registerFormManagementKeys.lists() })
        toast.success('Register form created successfully')
      } else {
        toast.error(response.errorMessage || 'Failed to create register form')
      }
    },
  })
}

export const useUpdateRegisterForm = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ data }: { data: UpdateRegisterFormRequest }) =>
      registerFormManagementApi.updateRegisterForm(data),
    onSuccess: (response) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({ queryKey: registerFormManagementKeys.lists() })
        toast.success('Register form updated successfully')
      }
      else {
        toast.error(response.errorMessage || 'Failed to update register form')
      }
    },
  })
}

export const useDeleteRegisterForm = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (mediaIds: string) => registerFormManagementApi.deleteRegisterForm(mediaIds),
    onSuccess: (response) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({ queryKey: registerFormManagementKeys.lists() })
        toast.success('Register form deleted successfully')
      } else {
        toast.error(response.errorMessage || 'Failed to delete register form')
      }
    },
  })
}

export const useDeleteRegisterForms = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (mediaIds: string) => registerFormManagementApi.deleteRegisterForms(mediaIds),
    onSuccess: (response) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({ queryKey: registerFormManagementKeys.lists() })
        toast.success('Register forms deleted successfully')
      } else {
        toast.error(response.errorMessage || 'Failed to delete register forms')
      }
    },
  })
}

export const useUpdateRegisterFormsStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ ids, statusId }: { ids: string; statusId: number }) =>
      registerFormManagementApi.updateRegisterFormsStatus(ids, statusId),
    onSuccess: (response, { statusId }) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({ queryKey: registerFormManagementKeys.lists() })
        toast.success(`Register forms updated to ${statusId === 1 ? 'active' : 'inactive'} successfully`)
      } else {
        toast.error(response.errorMessage || 'Failed to update register forms status')
      }
    },
  })
}
