import { apiClient } from '@/lib/api/client'
import type { IAxiosResponse } from '@/lib/api/types'
import type {
  GetLinksRequest,
  GetLinksResponse,
  GetLinkSummaryRequest,
  GetLinkSummaryResponse,
  UpdateLinkStatusRequest,
  UpdateLinkStatusResponse,
} from '../types'

type TargetCountry = {
  targetCountryCode: string
  targetCountryName: string
  languageCode: string
  languageName: string
  shortedLanguageCode: string
  status: number
}

type ComponentInfo = {
  componentId: number
  componentName: string
  componentCode: string
  componentTypeId: number
  statusId: number
  status: string
}

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

  async getCountries(): Promise<IAxiosResponse<TargetCountry[]>> {
    const response = await apiClient.get<IAxiosResponse<TargetCountry[]>>(
      '/settings/countries'
    )
    return response.data
  },

  async getChannels(): Promise<IAxiosResponse<ComponentInfo[]>> {
    const response = await apiClient.get<IAxiosResponse<ComponentInfo[]>>(
      '/component/category',
      { params: { categoryId: 3 } }
    )
    return response.data
  },
}

