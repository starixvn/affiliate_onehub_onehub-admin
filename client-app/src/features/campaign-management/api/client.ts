import { apiClient } from '@/lib/api/client'
import type {
  GetCampaignsRequest,
  GetCampaignsResponse,
  GetCampaignResponse,
  GetCampaignSummaryResponse,
  CreateCampaignRequest,
  CreateCampaignResponse,
  UpdateCampaignRequest,
  UpdateCampaignResponse,
  DeleteCampaignResponse,
} from '../types'

export const campaignApi = {
  async getCampaigns(
    params?: GetCampaignsRequest
  ): Promise<GetCampaignsResponse> {
    const response = await apiClient.get<GetCampaignsResponse>(
      '/campaign-management',
      { params }
    )
    return response.data
  },

  async getSummary(): Promise<GetCampaignSummaryResponse> {
    const response = await apiClient.get<GetCampaignSummaryResponse>(
      '/campaign-management/summary'
    )
    return response.data
  },

  async getCampaign(id: number): Promise<GetCampaignResponse> {
    const response = await apiClient.get<GetCampaignResponse>(
      `/campaign-management/${id}`
    )
    return response.data
  },

  async createCampaign(
    data: CreateCampaignRequest
  ): Promise<CreateCampaignResponse> {
    const response = await apiClient.post<CreateCampaignResponse>(
      '/campaign-management',
      data
    )
    return response.data
  },

  async updateCampaign(
    id: number,
    data: UpdateCampaignRequest
  ): Promise<UpdateCampaignResponse> {
    const response = await apiClient.put<UpdateCampaignResponse>(
      `/campaign-management/${id}`,
      data
    )
    return response.data
  },

  async deleteCampaign(id: number): Promise<DeleteCampaignResponse> {
    const response = await apiClient.delete<DeleteCampaignResponse>(
      `/campaign-management/${id}`
    )
    return response.data
  },

  async deleteCampaigns(ids: number[]): Promise<DeleteCampaignResponse> {
    const response = await apiClient.delete<DeleteCampaignResponse>(
      '/campaign-management',
      { data: { campaignIds: ids } }
    )
    return response.data
  },
}
