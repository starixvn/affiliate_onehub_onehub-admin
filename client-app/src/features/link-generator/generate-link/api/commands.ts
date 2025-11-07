import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { linkGeneratorApi } from './client'
import type { GenerateLinkRequest } from '../types'
import { linkGeneratorKeys } from './queries'

export function useGenerateLink() {
  return useMutation({
    mutationFn: (data: GenerateLinkRequest) => linkGeneratorApi.generateLink(data),
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

