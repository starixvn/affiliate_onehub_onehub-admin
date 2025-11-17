import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { UpdateLinkStatusRequest } from '../types'
import { linkApi } from './client'
import { linkKeys } from './queries'

export function useUpdateLinkStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLinkStatusRequest }) =>
      linkApi.updateLinkStatus(id, data),
    onSuccess: (response) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({ queryKey: linkKeys.lists() })
        queryClient.invalidateQueries({ queryKey: linkKeys.summaries() })
        toast.success('Link status updated successfully')
      } else {
        toast.error(response.errorMessage || 'Failed to update link status')
      }
    },
  })
}

