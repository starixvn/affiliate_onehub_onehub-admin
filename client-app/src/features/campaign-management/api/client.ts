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
  DeleteBatchCampaignRequest,
  DeleteCampaignResponse,
  UpdateBatchCampaignStatusRequest,
  UpdateBatchCampaignStatusResponse,
} from '../types'

export const campaignApi = {
  async getCampaigns(
    params?: GetCampaignsRequest
  ): Promise<GetCampaignsResponse> {
    const response = await apiClient.get<GetCampaignsResponse>('/campaign', {
      params,
    })
    return response.data
  },

  async exportCampaigns(
    params?: GetCampaignsRequest
  ): Promise<GetCampaignsResponse> {
    const response = await apiClient.get<GetCampaignsResponse>(
      '/campaign/export',
      {
        params,
      }
    )
    return response.data
  },

  async getSummary(): Promise<GetCampaignSummaryResponse> {
    const response =
      await apiClient.get<GetCampaignSummaryResponse>('/campaign/summary')
    return response.data
  },

  async getCampaign(id: number): Promise<GetCampaignResponse> {
    const response = await apiClient.get<GetCampaignResponse>(`/campaign/${id}`)
    return response.data
  },

  async createCampaign(
    data: CreateCampaignRequest
  ): Promise<CreateCampaignResponse> {
    const response = await apiClient.post<CreateCampaignResponse>(
      '/campaign',
      data
    )
    return response.data
  },

  async updateCampaign(
    id: number,
    data: UpdateCampaignRequest
  ): Promise<UpdateCampaignResponse> {
    const response = await apiClient.put<UpdateCampaignResponse>(
      `/campaign/${id}`,
      data
    )
    return response.data
  },

  async deleteCampaign(id: number): Promise<DeleteCampaignResponse> {
    const response = await apiClient.delete<DeleteCampaignResponse>(
      '/campaign/batch',
      { data: { campaignIds: String(id) } }
    )
    return response.data
  },

  async deleteCampaigns(ids: number[]): Promise<DeleteCampaignResponse> {
    const response = await apiClient.delete<DeleteCampaignResponse>(
      '/campaign/batch',
      { data: { campaignIds: ids.join(',') } }
    )
    return response.data
  },

  async deleteBatchCampaigns(
    data: DeleteBatchCampaignRequest
  ): Promise<DeleteCampaignResponse> {
    const response = await apiClient.delete<DeleteCampaignResponse>(
      '/campaign/batch',
      { data }
    )
    return response.data
  },

  async updateBatchCampaignStatus(
    data: UpdateBatchCampaignStatusRequest
  ): Promise<UpdateBatchCampaignStatusResponse> {
    const response = await apiClient.put<UpdateBatchCampaignStatusResponse>(
      '/campaign/status/batch',
      data
    )
    return response.data
  },
}
