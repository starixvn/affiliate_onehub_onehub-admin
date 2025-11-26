import type { IAxiosResponse } from '@/lib/api/types'
import type { IPaginatedResponse } from '@/lib/types/common'
import type { LinkInfo } from '../data/schema'

export interface LinkManagementRequest {
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

export interface LinkDashboardResponse {
  totalLinks: number
  totalClicks: number
  totalRegistrations: number
  totalFTDs: number
  avgFTDs: number
  bonus: number
}

export interface LinkManagementResponse {
  dashboard: LinkDashboardResponse
  links: IPaginatedResponse<LinkInfo>
}

export type LinkManagementApiResponse = IAxiosResponse<LinkManagementResponse>



export interface UpdateLinkStatusRequest {
  linkId: number
  statusId: number
}

export type UpdateLinkStatusResponse = IAxiosResponse<null>

