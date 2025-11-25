import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import type {
  CreateComponentRequest,
  UpdateComponentRequest,
  UpdateBatchComponentStatusRequest,
} from '../types'
import { componentApi } from './client'
import { componentKeys } from './queries'

export function useCreateComponent() {
  const queryClient = useQueryClient()
  const { t } = useTranslation('component-management')

  return useMutation({
    mutationFn: async (data: CreateComponentRequest) => {
      const response = await componentApi.createComponent(data)
      if (response.errorCode !== 0) {
        throw new Error(response.errorMessage || 'Failed to create component')
      }
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: componentKeys.lists() })
      queryClient.invalidateQueries({ queryKey: componentKeys.summary() })
      toast.success(t('toast.createSuccess'))
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : t('toast.unknownError')
      toast.error(message)
    },
  })
}

export function useUpdateComponent() {
  const queryClient = useQueryClient()
  const { t } = useTranslation('component-management')

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: UpdateComponentRequest
    }) => {
      const response = await componentApi.updateComponent(id, data)
      if (response.errorCode !== 0) {
        throw new Error(response.errorMessage || 'Failed to update component')
      }
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: componentKeys.lists() })
      queryClient.invalidateQueries({ queryKey: componentKeys.summary() })
      toast.success(t('toast.updateSuccess'))
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : t('toast.unknownError')
      toast.error(message)
    },
  })
}

export function useDeleteComponent() {
  const queryClient = useQueryClient()
  const { t } = useTranslation('component-management')

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await componentApi.deleteComponents({
        componentIds: String(id),
      })
      if (response.errorCode !== 0) {
        throw new Error(response.errorMessage || 'Failed to delete component')
      }
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: componentKeys.lists() })
      queryClient.invalidateQueries({ queryKey: componentKeys.summary() })
      toast.success(t('toast.deleteSuccess'))
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : t('toast.unknownError')
      toast.error(message)
    },
  })
}

export function useDeleteComponents() {
  const queryClient = useQueryClient()
  const { t } = useTranslation('component-management')

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await componentApi.deleteComponents({
        componentIds: ids.join(','),
      })
      if (response.errorCode !== 0) {
        throw new Error(response.errorMessage || 'Failed to delete components')
      }
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: componentKeys.lists() })
      queryClient.invalidateQueries({ queryKey: componentKeys.summary() })
      toast.success(t('toast.deleteMultipleSuccess'))
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : t('toast.unknownError')
      toast.error(message)
    },
  })
}

export function useUpdateBatchComponentStatus() {
  const queryClient = useQueryClient()
  const { t } = useTranslation('component-management')

  return useMutation({
    mutationFn: async (data: UpdateBatchComponentStatusRequest) => {
      const response = await componentApi.updateBatchComponentStatus(data)
      if (response.errorCode !== 0) {
        throw new Error(
          response.errorMessage || 'Failed to update component statuses'
        )
      }
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: componentKeys.lists() })
      queryClient.invalidateQueries({ queryKey: componentKeys.summary() })
      toast.success(t('toast.updateStatusSuccess'))
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : t('toast.unknownError')
      toast.error(message)
    },
  })
}
