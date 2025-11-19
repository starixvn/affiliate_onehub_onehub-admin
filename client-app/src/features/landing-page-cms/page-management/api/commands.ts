import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { landingPageApi } from './client'
import { landingPageKeys } from './queries'
import type {
  DeleteBatchLandingPageRequest,
  UpdateBatchLandingPageStatusRequest,
} from '../types'

export function useDeleteLandingPage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => landingPageApi.deleteLandingPage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: landingPageKeys.lists() })
      queryClient.invalidateQueries({ queryKey: landingPageKeys.summary() })
      toast.success('Landing page deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete landing page')
    },
  })
}

export function useDeleteBatchLandingPages() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: DeleteBatchLandingPageRequest) =>
      landingPageApi.deleteBatchLandingPages(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: landingPageKeys.lists() })
      queryClient.invalidateQueries({ queryKey: landingPageKeys.summary() })
      toast.success('Landing pages deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete landing pages')
    },
  })
}

export function useUpdateBatchLandingPageStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateBatchLandingPageStatusRequest) =>
      landingPageApi.updateBatchLandingPageStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: landingPageKeys.lists() })
      queryClient.invalidateQueries({ queryKey: landingPageKeys.summary() })
      toast.success('Landing page status updated successfully')
    },
    onError: () => {
      toast.error('Failed to update landing page status')
    },
  })
}
