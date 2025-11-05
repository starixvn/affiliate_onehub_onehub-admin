import { apiClient } from '@/lib/api/client'
import type {
  GetLinkGeneratorOptionsResponse,
  GenerateLinkRequest,
  GenerateLinkResponse,
  TargetCountry,
} from '../types'
import type { IAxiosResponse } from '@/lib/types/common'

type InsertComponentRequest = {
  componentName: string
  componentCode: string
  componentTypeId: number
  statusId: number
}

export const linkGeneratorApi = {
  async getOptions(): Promise<GetLinkGeneratorOptionsResponse> {
    const response = await apiClient.get<GetLinkGeneratorOptionsResponse>(
      '/link-generator/form-options'
    )
    return response.data
  },

  async getLanguagesByCountry(countryCode: string): Promise<IAxiosResponse<TargetCountry[]>> {
    const response = await apiClient.get<IAxiosResponse<TargetCountry[]>>(
      `/link-generator/languages/${countryCode}`
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
      result: {
        fullLink: `https://example.com/track/${Date.now()}`,
        shortLink: `https://short.link/${Math.random().toString(36).substring(7)}`,
      },
    }
  },
}

