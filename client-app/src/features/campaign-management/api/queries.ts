import { useQuery } from '@tanstack/react-query'
import type { GetCampaignsRequest } from '../types'
import { campaignApi } from './client'

export const campaignKeys = {
  all: ['campaigns'] as const,
  lists: () => [...campaignKeys.all, 'list'] as const,
  list: (params?: GetCampaignsRequest) =>
    [...campaignKeys.lists(), params] as const,
  summary: () => [...campaignKeys.all, 'summary'] as const,
}

export function useGetCampaigns(params?: GetCampaignsRequest) {
  return useQuery({
    queryKey: campaignKeys.list(params),
    queryFn: () => campaignApi.getCampaigns(params),
    select: (data) => data.result,
  })
}

export function useGetCampaignSummary() {
  return useQuery({
    queryKey: campaignKeys.summary(),
    queryFn: () => campaignApi.getSummary(),
    select: (data) => data.result,
  })
}
