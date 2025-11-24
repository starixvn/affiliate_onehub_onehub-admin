import { apiClient } from '@/lib/api/client'
import type {
  GetComponentSummaryResponse,
  GetComponentsRequest,
  GetComponentsResponse,
  CreateComponentRequest,
  CreateComponentResponse,
  UpdateComponentRequest,
  UpdateComponentResponse,
  DeleteBatchComponentRequest,
  DeleteComponentResponse,
  UpdateBatchComponentStatusRequest,
  UpdateBatchComponentStatusResponse,
} from '../types'

class ComponentApi {
  async getSummary(): Promise<GetComponentSummaryResponse> {
    const response =
      await apiClient.get<GetComponentSummaryResponse>('/component/summary')
    return response.data
  }

  async getComponents(
    params?: GetComponentsRequest
  ): Promise<GetComponentsResponse> {
    const response = await apiClient.get<GetComponentsResponse>('/component', {
      params,
    })
    return response.data
  }

  async exportComponents(
    params?: GetComponentsRequest
  ): Promise<GetComponentsResponse> {
    const response = await apiClient.get<GetComponentsResponse>(
      '/component/export',
      { params }
    )
    return response.data
  }

  async createComponent(
    data: CreateComponentRequest
  ): Promise<CreateComponentResponse> {
    const response = await apiClient.post<CreateComponentResponse>(
      '/component',
      data
    )
    return response.data
  }

  async updateComponent(
    id: number,
    data: UpdateComponentRequest
  ): Promise<UpdateComponentResponse> {
    const response = await apiClient.put<UpdateComponentResponse>(
      `/component/${id}`,
      data
    )
    return response.data
  }

  async deleteComponents(
    request: DeleteBatchComponentRequest
  ): Promise<DeleteComponentResponse> {
    const response = await apiClient.delete<DeleteComponentResponse>(
      '/component/batch',
      { data: request }
    )
    return response.data
  }

  async updateBatchComponentStatus(
    data: UpdateBatchComponentStatusRequest
  ): Promise<UpdateBatchComponentStatusResponse> {
    const response = await apiClient.put<UpdateBatchComponentStatusResponse>(
      '/component/status/batch',
      data
    )
    return response.data
  }
}

export const componentApi = new ComponentApi()
