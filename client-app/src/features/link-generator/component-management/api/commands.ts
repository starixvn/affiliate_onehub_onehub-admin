import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  CreateComponentRequest,
  UpdateComponentRequest,
} from '../types'
import { componentApi } from './client'
import { componentKeys } from './queries'

export function useCreateComponent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateComponentRequest) =>
      componentApi.createComponent(data),
    onSuccess: (response) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({ queryKey: componentKeys.lists() })
        queryClient.invalidateQueries({ queryKey: componentKeys.summary() })
        toast.success('Component created successfully')
      } else {
        toast.error(response.errorMessage || 'Failed to create component')
      }
    },
  })
}

export function useUpdateComponent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateComponentRequest }) =>
      componentApi.updateComponent(id, data),
    onSuccess: (response) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({ queryKey: componentKeys.lists() })
        queryClient.invalidateQueries({ queryKey: componentKeys.summary() })
        toast.success('Component updated successfully')
      } else {
        toast.error(response.errorMessage || 'Failed to update component')
      }
    },
  })
}
