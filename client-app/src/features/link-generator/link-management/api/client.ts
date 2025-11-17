import { apiClient } from '@/lib/api/client'
import type {
  GetLinksRequest,
  GetLinksResponse,
  GetLinkSummaryRequest,
  GetLinkSummaryResponse,
  UpdateLinkStatusRequest,
  UpdateLinkStatusResponse,
} from '../types'

export const linkApi = {
  async getLinks(params?: GetLinksRequest): Promise<GetLinksResponse> {
    const response = await apiClient.get<GetLinksResponse>('/link', {
      params,
    })
    return response.data
  },

  async exportLinks(params?: GetLinksRequest): Promise<GetLinksResponse> {
    const response = await apiClient.get<GetLinksResponse>('/link/export', {
      params,
    })
    return response.data
  },

  async getSummary(
    params?: GetLinkSummaryRequest
  ): Promise<GetLinkSummaryResponse> {
    const response = await apiClient.get<GetLinkSummaryResponse>(
      '/link/summary',
      {
        params,
      }
    )
    return response.data
  },

  async updateLinkStatus(
    id: number,
    data: UpdateLinkStatusRequest
  ): Promise<UpdateLinkStatusResponse> {
    const response = await apiClient.put<UpdateLinkStatusResponse>(
      `/link/${id}/status`,
      data
    )
    return response.data
  },
}

