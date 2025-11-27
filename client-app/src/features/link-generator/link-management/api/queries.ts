import { useQuery } from '@tanstack/react-query'
import type { LinkManagementRequest } from '../types'
import { linkApi } from './client'

export const linkKeys = {
  all: ['links'] as const,
  lists: () => [...linkKeys.all, 'list'] as const,
  list: (params?: LinkManagementRequest) => [...linkKeys.lists(), params] as const,
  countries: () => [...linkKeys.all, 'countries'] as const,
  channels: () => [...linkKeys.all, 'channels'] as const,
}

export function useGetLinkManagement(params?: LinkManagementRequest) {
  return useQuery({
    queryKey: linkKeys.list(params),
    queryFn: () => linkApi.getLinkManagement(params),
    select: (data) => data.data,
  })
}

export function useGetCountries() {
  return useQuery({
    queryKey: linkKeys.countries(),
    queryFn: () => linkApi.getCountries(),
    select: (data) => data.data,
  })
}

export function useGetChannels() {
  return useQuery({
    queryKey: linkKeys.channels(),
    queryFn: () => linkApi.getChannels(),
    select: (data) => data.data,
  })
}