import type { IAxiosResponse } from '@/lib/api/types'
import type { IPaginatedResponse } from '@/lib/types/common'
import type { Component } from '../data/schema'

export interface ComponentSummaryItem {
  componentTypeId: number
  componentTypeName: string
  total: number
  active: number
  inactive: number
}

export type GetComponentSummaryResponse = IAxiosResponse<ComponentSummaryItem[]>

export interface CategorySummary {
  total: number
  active: number
  inactive: number
}

export interface ComponentCategorySummary {
  event: CategorySummary
  group: CategorySummary
  channel: CategorySummary
  agency: CategorySummary
  type: CategorySummary
  landingPage: CategorySummary
}

export interface GetComponentsRequest {
  search?: string
  category?: string
  status?: string
  deviceIds?: string
  pageIndex?: number
  pageSize?: number
  isExportExcel?: boolean
}

export type GetComponentsResponseData = IPaginatedResponse<Component>

export type GetComponentsResponse = IAxiosResponse<GetComponentsResponseData>
