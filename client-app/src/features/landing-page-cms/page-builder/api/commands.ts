import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { pageBuilderApi } from './client'
import type { CreatePageBuilderRequest } from '../types'
import { pageBuilderKeys } from './queries'

export function useCreatePageBuilder() {
  return useMutation({
    mutationFn: async (data: CreatePageBuilderRequest) => {
      const response = await pageBuilderApi.createPageBuilder(data)
      if (response.errorCode === 0) {
        toast.success('Page created successfully!')
        return response.data
      } else {
        toast.error(response.errorMessage || 'Failed to create page')
        throw new Error(response.errorMessage || 'Failed to create page')
      }
    },
    onError: (error: unknown) => {
      let errorMessage = 'Failed to create page'
      const axiosError = error as { response?: { data?: { errors?: Record<string, string[]>; errorMessage?: string } }; message?: string }
      if (axiosError.response?.data?.errors) {
        const validationErrors = axiosError.response.data.errors
        errorMessage = Object.values(validationErrors).flat().join('\n')
      } else if (axiosError.response?.data?.errorMessage) {
        errorMessage = axiosError.response.data.errorMessage
      } else if (axiosError.message) {
        errorMessage = axiosError.message
      }
      toast.error(errorMessage, {
        style: {
          whiteSpace: 'pre-line',
        },
      })
    },
  })
}

export function useUpdatePageBuilder() {
  return useMutation({
    mutationFn: async (data: CreatePageBuilderRequest) => {
      const response = await pageBuilderApi.updatePageBuilder(data)
      if (response.errorCode === 0) {
        toast.success('Page updated successfully!')
        return response.data
      } else {
        toast.error(response.errorMessage || 'Failed to update page')
        throw new Error(response.errorMessage || 'Failed to update page')
      }
    },
    onError: (error: unknown) => {
      let errorMessage = 'Failed to update page'
      const axiosError = error as { response?: { data?: { errors?: Record<string, string[]>; errorMessage?: string } }; message?: string }
      if (axiosError.response?.data?.errors) {
        const validationErrors = axiosError.response.data.errors
        errorMessage = Object.values(validationErrors).flat().join('\n')
      } else if (axiosError.response?.data?.errorMessage) {
        errorMessage = axiosError.response.data.errorMessage
      } else if (axiosError.message) {
        errorMessage = axiosError.message
      }
      toast.error(errorMessage, {
        style: {
          whiteSpace: 'pre-line',
        },
      })
    },
  })
}

export function useInsertLink() {
  return useMutation({
    mutationFn: (data: InsertLinkRequest) => pageBuilderApi.insertLink(data),
    onSuccess: (response) => {
      if (response.errorCode === 0) {
        toast.success('Link generated successfully!')
      } else {
        toast.error(response.errorMessage || 'Failed to generate link')
      }
    },
    onError: (error: unknown) => {
      let errorMessage = 'Failed to generate link';
      const axiosError = error as { response?: { data?: { errors?: Record<string, string[]>; errorMessage?: string } }; message?: string };
      if (axiosError.response?.data?.errors) {
        const validationErrors = axiosError.response.data.errors;
        errorMessage = Object.values(validationErrors).flat().join('\n');
      } else if (axiosError.response?.data?.errorMessage) {
        errorMessage = axiosError.response.data.errorMessage;
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      }
      toast.error(errorMessage, {
        style: {
          whiteSpace: 'pre-line',
        },
      });
    },
  })
}

type CreateComponentRequest = {
  categoryId: number
  componentName: string
  componentCode: string
  statusId: number
}

export function useCreateComponent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateComponentRequest) => pageBuilderApi.insertComponent(data),
    onSuccess: (response, variables) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({ 
          queryKey: pageBuilderKeys.components(variables.categoryId) 
        })
        toast.success('Component created successfully')
      } else {
        toast.error(response.errorMessage || 'Failed to create component')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create component')
    },
  })
}

type CreateCampaignRequest = {
  campaignName: string
  description?: string
  statusId?: number
}

export function useCreateCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCampaignRequest) =>
      pageBuilderApi.createCampaign(data),
    onSuccess: (response) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({
          queryKey: pageBuilderKeys.campaigns(),
        })
        toast.success('Campaign created successfully')
      } else {
        toast.error(response.errorMessage || 'Failed to create campaign')
      }
    },
  })
}

