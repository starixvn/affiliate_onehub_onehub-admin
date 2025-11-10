import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { linkGeneratorApi } from './client'
import type { GenerateLinkRequest, InsertLinkRequest } from '../types'
import { linkGeneratorKeys } from './queries'

export function useGenerateLink() {
  return useMutation({
    mutationFn: (data: GenerateLinkRequest) => linkGeneratorApi.generateLink(data),
  })
}

export function useInsertLink() {
  return useMutation({
    mutationFn: (data: InsertLinkRequest) => linkGeneratorApi.insertLink(data),
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
  componentTypeId: number
  componentName: string
  componentCode: string
  statusId: number
}

export function useCreateComponent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateComponentRequest) => linkGeneratorApi.insertComponent(data),
    onSuccess: (response, variables) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({ 
          queryKey: linkGeneratorKeys.components(variables.componentTypeId) 
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

