import { apiClient } from '@/lib/api/client'
import type {
  GetLinkGeneratorOptionsResponse,
  GenerateLinkRequest,
  GenerateLinkResponse,
  TargetCountry,
} from '../types'
import type { IAxiosResponse } from '@/lib/api/types'

type InsertComponentRequest = {
  componentName: string
  componentCode: string
  componentTypeId: number
  statusId: number
}

export const linkGeneratorApi = {
  async getOptions(): Promise<GetLinkGeneratorOptionsResponse> {
    const response = await apiClient.get<GetLinkGeneratorOptionsResponse>(
      '/generate-link/form-options'
    )
    return response.data
  },

  async getLanguagesByCountry(countryCode: string): Promise<IAxiosResponse<TargetCountry[]>> {
    const response = await apiClient.get<IAxiosResponse<TargetCountry[]>>(
      `/settings/language`,
      { params: { countryCode } }
    )
    return response.data
  },

  async insertComponent(data: InsertComponentRequest): Promise<IAxiosResponse> {
    const response = await apiClient.post<IAxiosResponse>(
      '/component',
      data
    )
    return response.data
  },

  async generateLink(
    _data: GenerateLinkRequest
  ): Promise<GenerateLinkResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    return {
      errorCode: 0,
      errorMessage: '',
      data: {
        fullLink: `https://example.com/track/${Date.now()}`,
        shortLink: `https://short.link/${Math.random().toString(36).substring(7)}`,
      },
    }
  },
}

