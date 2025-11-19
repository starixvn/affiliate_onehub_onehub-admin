import type { IAxiosResponse } from '@/lib/api/types'
import type { IPaginatedResponse } from '@/lib/types/common'
import type { LinkInfo } from '../data/schema'

export interface GetLinksRequest {
  search?: string
  statusIds?: string
  countryCodes?: string
  channelIds?: string
  startDate?: string
  endDate?: string
  pageIndex?: number
  pageSize?: number
  isExportExcel?: boolean
}

export type GetLinksResponseData = IPaginatedResponse<LinkInfo>

export type GetLinksResponse = IAxiosResponse<GetLinksResponseData>

export interface GetLinkSummaryRequest {
  search?: string
  countryCodes?: string
  channelIds?: string
  startDate?: string
  endDate?: string
}

export interface GetLinkSummaryResponseData {
  totalLinks: number
  uniqueClicks: number
  totalRegistrations: number
  totalFtds: number
  avgFtdAmount: number
}

export type GetLinkSummaryResponse =
  IAxiosResponse<GetLinkSummaryResponseData>

export interface UpdateLinkStatusRequest {
  linkId: number
  statusId: number
}

export type UpdateLinkStatusResponse = IAxiosResponse<null>

