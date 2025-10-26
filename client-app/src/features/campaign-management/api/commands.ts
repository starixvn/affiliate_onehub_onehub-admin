import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { CreateCampaignRequest, UpdateCampaignRequest } from '../types'
import { campaignApi } from './client'
import { campaignKeys } from './queries'

export function useCreateCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCampaignRequest) =>
      campaignApi.createCampaign(data),
    onSuccess: (response) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({ queryKey: campaignKeys.lists() })
        queryClient.invalidateQueries({ queryKey: campaignKeys.summary() })
        toast.success('Campaign created successfully')
      } else {
        toast.error(response.errorMessage || 'Failed to create campaign')
      }
    },
  })
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCampaignRequest }) =>
      campaignApi.updateCampaign(id, data),
    onSuccess: (response) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({ queryKey: campaignKeys.lists() })
        queryClient.invalidateQueries({ queryKey: campaignKeys.summary() })
        toast.success('Campaign updated successfully')
      } else {
        toast.error(response.errorMessage || 'Failed to update campaign')
      }
    },
  })
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => campaignApi.deleteCampaign(id),
    onSuccess: (response) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({ queryKey: campaignKeys.lists() })
        queryClient.invalidateQueries({ queryKey: campaignKeys.summary() })
        toast.success('Campaign deleted successfully')
      } else {
        toast.error(response.errorMessage || 'Failed to delete campaign')
      }
    },
  })
}

export function useDeleteCampaigns() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: number[]) => campaignApi.deleteCampaigns(ids),
    onSuccess: (response) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({ queryKey: campaignKeys.lists() })
        queryClient.invalidateQueries({ queryKey: campaignKeys.summary() })
        toast.success('Campaigns deleted successfully')
      } else {
        toast.error(response.errorMessage || 'Failed to delete campaigns')
      }
    },
  })
}
