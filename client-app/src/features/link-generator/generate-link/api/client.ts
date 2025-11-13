import { apiClient } from '@/lib/api/client'
import type {
  GenerateLinkRequest,
  GenerateLinkResponse,
  TargetCountry,
  Market,
  CampaignInfo,
  ComponentInfo,
  LandingPageOption,
  DomainInfo,
  InsertLinkRequest,
  InsertLinkResponse,
} from '../types'
import type { IAxiosResponse } from '@/lib/api/types'

type InsertComponentRequest = {
  componentName: string
  componentCode: string
  categoryId: number
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

  async getLanguages(): Promise<IAxiosResponse<Market[]>> {
    const response = await apiClient.get<IAxiosResponse<Market[]>>(
      '/settings/languages'
    )
    return response.data
  },

  async getComponentsByCategory(categoryId: number): Promise<IAxiosResponse<ComponentInfo[]>> {
    const response = await apiClient.get<IAxiosResponse<ComponentInfo[]>>(
      '/component/category',
      { params: { categoryId } }
    )
    return response.data
  },

  async getEvents(): Promise<IAxiosResponse<ComponentInfo[]>> {
    return this.getComponentsByCategory(1)
  },

  async getGroups(): Promise<IAxiosResponse<ComponentInfo[]>> {
    return this.getComponentsByCategory(2)
  },

  async getChannels(): Promise<IAxiosResponse<ComponentInfo[]>> {
    return this.getComponentsByCategory(3)
  },

  async getAgencies(): Promise<IAxiosResponse<ComponentInfo[]>> {
    return this.getComponentsByCategory(4)
  },

  async getTypes(): Promise<IAxiosResponse<ComponentInfo[]>> {
    return this.getComponentsByCategory(5)
  },

  async getLandingPages(): Promise<IAxiosResponse<Record<string, LandingPageOption[]>>> {
    const response = await apiClient.get<IAxiosResponse<Record<string, LandingPageOption[]>>>(
      '/landing-page/options'
    )
    return response.data
  },

  async getDomains(countryCode: string, domainType: number): Promise<IAxiosResponse<DomainInfo[]>> {
    const response = await apiClient.get<IAxiosResponse<DomainInfo[]>>(
      '/domain',
      { params: { countryCode, domainType } }
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

  async insertLink(data: InsertLinkRequest): Promise<InsertLinkResponse> {
    const response = await apiClient.post<InsertLinkResponse>(
      '/generate-link/insert',
      data
    )
    return response.data
  },

  async createCampaign(data: {
    campaignName: string
    description?: string
    statusId?: number
  }): Promise<IAxiosResponse> {
    const response = await apiClient.post<IAxiosResponse>(
      '/campaign',
      data
    )
    return response.data
  },
}

