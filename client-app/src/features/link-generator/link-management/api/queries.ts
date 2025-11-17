import { useQuery } from '@tanstack/react-query'
import type { GetLinksRequest, GetLinkSummaryRequest } from '../types'
import { linkApi } from './client'

export const linkKeys = {
  all: ['links'] as const,
  lists: () => [...linkKeys.all, 'list'] as const,
  list: (params?: GetLinksRequest) => [...linkKeys.lists(), params] as const,
  summaries: () => [...linkKeys.all, 'summary'] as const,
  summary: (params?: GetLinkSummaryRequest) =>
    [...linkKeys.summaries(), params] as const,
}

export function useGetLinks(params?: GetLinksRequest) {
  return useQuery({
    queryKey: linkKeys.list(params),
    queryFn: () => linkApi.getLinks(params),
    select: (data) => data.data,
  })
}

export function useGetLinkSummary(params?: GetLinkSummaryRequest) {
  return useQuery({
    queryKey: linkKeys.summary(params),
    queryFn: () => linkApi.getSummary(params),
    select: (data) => data.data,
  })
}

