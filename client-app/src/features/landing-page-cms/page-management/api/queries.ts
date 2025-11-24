import { useQuery } from '@tanstack/react-query'
import type {
  GetLandingPagesRequest,
  GetPageManagementDashboardRequest,
  PageStatus,
} from '../types'
import { landingPageApi } from './client'

export const landingPageKeys = {
  all: ['landing-pages'] as const,
  lists: () => [...landingPageKeys.all, 'list'] as const,
  list: (params?: GetLandingPagesRequest) =>
    [...landingPageKeys.lists(), params] as const,
  summary: () => [...landingPageKeys.all, 'summary'] as const,
  filters: () => [...landingPageKeys.all, 'filters'] as const,
}

export function useGetLandingPages(params?: GetLandingPagesRequest) {
  return useQuery({
    queryKey: landingPageKeys.list(params),
    queryFn: () => landingPageApi.getLandingPages(params),
    select: (data) => data.data,
  })
}

export function useGetLandingPageSummary() {
  return useQuery({
    queryKey: landingPageKeys.summary(),
    queryFn: () => landingPageApi.getSummary(),
    select: (data) => data.data,
  })
}

export const usePageFilters = () => {
  const query = useQuery({
    queryKey: landingPageKeys.filters(),
    queryFn: () => landingPageApi.getPageFilters(),
    select: selectPageFilters,
  })

  return {
    ...query.data,
    isLoading: query.isLoading,
    error: query.error,
  }
}

const selectPageFilters = (data: any) => {
  const response = data.data

  const minDate = response?.minDate
    ? new Date(response.minDate)
    : new Date(
        new Date().getFullYear() - 2,
        new Date().getMonth(),
        new Date().getDate()
      )
  minDate.setHours(0, 0, 0, 0)

  const maxDate = response?.maxDate ? new Date(response.maxDate) : new Date()
  maxDate.setHours(0, 0, 0, 0)

  let defaultFromDate = response?.defaultFromDate
    ? new Date(response.defaultFromDate)
    : new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)
  defaultFromDate.setHours(0, 0, 0, 0)

  if (defaultFromDate < minDate) {
    defaultFromDate = minDate
  }

  const defaultToDate = response?.defaultToDate
    ? new Date(response.defaultToDate)
    : maxDate
  defaultToDate.setHours(0, 0, 0, 0)

  return {
    countries: response?.targetCountries ?? [],
    languages: response?.languages ?? [],
    pageStatus:
      response?.statusInfos.filter(
        (status: PageStatus) => status.statusId !== undefined
      ) ?? [],
    landingPageUrl: response?.landingPageUrl ?? '',
    minDate,
    maxDate,
    defaultFromDate,
    defaultToDate,
  }
}
