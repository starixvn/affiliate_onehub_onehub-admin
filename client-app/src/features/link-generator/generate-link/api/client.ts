import { apiClient } from '@/lib/api/client'
import type {
  GenerateLinkRequest,
  GenerateLinkResponse,
  TargetCountry,
  CampaignInfo,
  ComponentInfo,
  LandingPageOption,
} from '../types'
import type { IAxiosResponse } from '@/lib/api/types'

type InsertComponentRequest = {
  componentName: string
  componentCode: string
  componentTypeId: number
  statusId: number
}

export const linkGeneratorApi = {
  async getCampaigns(): Promise<IAxiosResponse<CampaignInfo[]>> {
    const response = await apiClient.get<IAxiosResponse<CampaignInfo[]>>(
      '/campaign/dropdown'
    )
    return response.data
  },

  async getCountries(): Promise<IAxiosResponse<TargetCountry[]>> {
    const response = await apiClient.get<IAxiosResponse<TargetCountry[]>>(
      '/settings/countries'
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

  async getComponentsByType(componentTypeId: number): Promise<IAxiosResponse<ComponentInfo[]>> {
    const response = await apiClient.get<IAxiosResponse<ComponentInfo[]>>(
      '/component',
      { params: { componentTypeId } }
    )
    return response.data
  },

  async getEvents(): Promise<IAxiosResponse<ComponentInfo[]>> {
    return this.getComponentsByType(1)
  },

  async getGroups(): Promise<IAxiosResponse<ComponentInfo[]>> {
    return this.getComponentsByType(2)
  },

  async getChannels(): Promise<IAxiosResponse<ComponentInfo[]>> {
    return this.getComponentsByType(3)
  },

  async getAgencies(): Promise<IAxiosResponse<ComponentInfo[]>> {
    return this.getComponentsByType(4)
  },

  async getTypes(): Promise<IAxiosResponse<ComponentInfo[]>> {
    return this.getComponentsByType(5)
  },

  async getLandingPages(): Promise<IAxiosResponse<LandingPageOption[]>> {
    const response = await apiClient.get<IAxiosResponse<LandingPageOption[]>>(
      '/landing-page/options'
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

