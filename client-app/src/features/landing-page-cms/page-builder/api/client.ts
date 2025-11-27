import { apiClient } from '@/lib/api/client'
import type {
  TargetCountry,
  CampaignInfo,
  CreatePageBuilderRequest,
  CreatePageBuilderResponse,
  Module,
  MediaSource,
  PageBuilderDetails
} from '../types'
import type { IAxiosResponse } from '@/lib/api/types'

export const pageBuilderApi = {
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

  async getLanguages(countryCode: string): Promise<IAxiosResponse<TargetCountry[]>> {
    const response = await apiClient.get<IAxiosResponse<TargetCountry[]>>(
      '/settings/languages',
      { params: { countryCode } }
    )
    return response.data
  },

  async getModules(moduleId?: number): Promise<IAxiosResponse<Module[]>> {
    const config = moduleId !== undefined && moduleId !== null 
      ? { params: { moduleId } }
      : {}
    const response = await apiClient.get<IAxiosResponse<Module[]>>(
      '/pagebuilder/modules',
      config
    )
    return response.data
  },

  async getMediaSources(languageCode: string, targetCountryCode: string, moduleId?: number): Promise<IAxiosResponse<MediaSource[]>> {
    const params: Record<string, string | number> = {
      languageCode,
      targetCountryCode,
    }
    if (moduleId !== undefined && moduleId !== null) {
      params.moduleId = moduleId
    }
    const response = await apiClient.get<IAxiosResponse<MediaSource[]>>(
      '/pagebuilder/media',
      { params }
    )
    return response.data
  },

  async getPageBuilderDetails(pageId: number, isPreview: boolean): Promise<IAxiosResponse<PageBuilderDetails>> {
    const params: Record<'pageId' | 'isPreview', number | boolean> = {
      pageId,
      isPreview,
    }
    const response = await apiClient.get<IAxiosResponse<PageBuilderDetails>>(
      '/pagebuilder/detail',
      { params }
    )
    return response.data
  },

  async createPageBuilder(data: CreatePageBuilderRequest): Promise<CreatePageBuilderResponse> {
    const response = await apiClient.post<CreatePageBuilderResponse>(
      '/pagebuilder/create',
      data
    )
    return response.data
  },

  async updatePageBuilder(data: CreatePageBuilderRequest): Promise<CreatePageBuilderResponse> {
    const response = await apiClient.put<CreatePageBuilderResponse>(
      '/pagebuilder/update',
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

