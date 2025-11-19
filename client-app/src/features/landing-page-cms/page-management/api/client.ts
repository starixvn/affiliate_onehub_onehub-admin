import { apiClient } from '@/lib/api/client'
import type {
  GetLandingPagesRequest,
  GetLandingPagesResponse,
  GetLandingPageResponse,
  GetLandingPageSummaryResponse,
  GetPageFiltersResponse,
  DeleteBatchLandingPageRequest,
  DeleteLandingPageResponse,
  UpdateBatchLandingPageStatusRequest,
  UpdateBatchLandingPageStatusResponse,
  GetPageManagementDashboardRequest,
} from '../types'

export const landingPageApi = {
  async getLandingPages(
    params?: GetLandingPagesRequest
  ): Promise<GetLandingPagesResponse> {
    const response = await apiClient.get<GetLandingPagesResponse>(
      '/page-management',
      {
        params,
      }
    )
    return response.data
  },

  async exportLandingPages(
    params?: GetLandingPagesRequest
  ): Promise<GetLandingPagesResponse> {
    const response = await apiClient.get<GetLandingPagesResponse>(
      '/page-management/export',
      {
        params,
      }
    )
    return response.data
  },

  async getSummary(
    params?: GetPageManagementDashboardRequest
  ): Promise<GetLandingPageSummaryResponse> {
    const response = await apiClient.get<GetLandingPageSummaryResponse>(
      '/page-management/summary',
      {
        params,
      }
    )
    return response.data
  },

  async getLandingPage(id: number): Promise<GetLandingPageResponse> {
    const response = await apiClient.get<GetLandingPageResponse>(
      `/page-management/${id}`
    )
    return response.data
  },

  async deleteLandingPage(id: number): Promise<DeleteLandingPageResponse> {
    const response = await apiClient.delete<DeleteLandingPageResponse>(
      '/page-management/batch',
      { data: { pageIds: String(id) } }
    )
    return response.data
  },

  async deleteLandingPages(ids: number[]): Promise<DeleteLandingPageResponse> {
    const response = await apiClient.delete<DeleteLandingPageResponse>(
      '/page-management/batch',
      { data: { pageIds: ids.join(',') } }
    )
    return response.data
  },

  async deleteBatchLandingPages(data: DeleteBatchLandingPageRequest): Promise<DeleteLandingPageResponse> {
    const response = await apiClient.delete<DeleteLandingPageResponse>(
      '/page-management/batch',
      { data }
    )
    return response.data
  },

  async updateBatchLandingPageStatus(
    data: UpdateBatchLandingPageStatusRequest
  ): Promise<UpdateBatchLandingPageStatusResponse> {
    const response =
      await apiClient.put<UpdateBatchLandingPageStatusResponse>(
        '/page-management/status/batch',
        data
      )
    return response.data
  },

  async getPageFilters(): Promise<GetPageFiltersResponse> {
    const response = await apiClient.get<GetPageFiltersResponse>(
      '/page-management/filters'
    )
    return response.data
  },
}
