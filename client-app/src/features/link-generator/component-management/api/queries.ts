import { useQuery } from '@tanstack/react-query'
import { componentApi } from './client'
import { componentSchema } from '../data/schema'
import type {
  ComponentCategorySummary,
  ComponentSummaryItem,
  GetComponentsRequest,
} from '../types'

export const componentKeys = {
  all: ['component'] as const,
  summary: () => [...componentKeys.all, 'summary'] as const,
  lists: () => [...componentKeys.all, 'list'] as const,
  list: (params?: GetComponentsRequest) => [...componentKeys.lists(), params] as const,
}

function transformSummaryData(items: ComponentSummaryItem[]): ComponentCategorySummary {
  const defaultSummary = { total: 0, active: 0, inactive: 0 }

  const summaryMap: Record<number, keyof ComponentCategorySummary> = {
    1: 'event',
    2: 'group',
    3: 'channel',
    4: 'agency',
    5: 'type',
    6: 'landingPage',
  }

  const result: ComponentCategorySummary = {
    event: { ...defaultSummary },
    group: { ...defaultSummary },
    channel: { ...defaultSummary },
    agency: { ...defaultSummary },
    type: { ...defaultSummary },
    landingPage: { ...defaultSummary },
  }

  items.forEach((item) => {
    const key = summaryMap[item.componentTypeId]
    if (key) {
      result[key] = {
        total: item.total,
        active: item.active,
        inactive: item.inactive,
      }
    }
  })

  return result
}

export function useGetComponentSummary() {
  return useQuery({
    queryKey: componentKeys.summary(),
    queryFn: () => componentApi.getSummary(),
    select: (response) => transformSummaryData(response.data),
  })
}

export function useGetComponents(params?: GetComponentsRequest) {
  return useQuery({
    queryKey: componentKeys.list(params),
    queryFn: () => componentApi.getComponents(params),
    select: (response) => {
      const items = response.data.items.map((item) => componentSchema.parse(item))
      return {
        ...response.data,
        items,
      }
    },
  })
}
