import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  DeleteBatchLandingPageRequest,
  UpdateBatchLandingPageStatusRequest,
} from '../types'
import { landingPageApi } from './client'
import { landingPageKeys } from './queries'

export function useDeleteLandingPage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => landingPageApi.deleteLandingPage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: landingPageKeys.lists() })
      toast.success('Landing page deleted successfully')
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to delete landing page')
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
      toast.success('Landing pages deleted successfully')
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to delete landing pages')
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
      toast.success('Landing page status updated successfully')
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to update landing page status')
    },
  })
}
