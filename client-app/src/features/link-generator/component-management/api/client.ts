import { apiClient } from '@/lib/api/client'
import type {
  GetComponentSummaryResponse,
  GetComponentsRequest,
  GetComponentsResponse,
} from '../types'

class ComponentApi {
  async getSummary(): Promise<GetComponentSummaryResponse> {
    const response = await apiClient.get<GetComponentSummaryResponse>('/component/summary')
    return response.data
  }

  async getComponents(params?: GetComponentsRequest): Promise<GetComponentsResponse> {
    const response = await apiClient.get<GetComponentsResponse>('/component', { params })
    return response.data
  }
}

export const componentApi = new ComponentApi()
