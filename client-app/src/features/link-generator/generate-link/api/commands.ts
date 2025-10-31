import { useMutation, useQueryClient } from '@tanstack/react-query'
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: linkGeneratorKeys.options() })
    },
  })
}

