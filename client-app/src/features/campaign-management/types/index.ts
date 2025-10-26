import type { IAxiosResponse, IPaginatedResponse } from '@/lib/types/common'
import type { Campaign } from '../data/schema'

export interface GetCampaignsRequest {
  search?: string
  status?: string
  pageIndex?: number
  pageSize?: number
}

export type GetCampaignsResponseData = IPaginatedResponse<Campaign>

export type GetCampaignsResponse = IAxiosResponse<GetCampaignsResponseData>

export interface GetCampaignSummaryResponseData {
  total: number
  active: number
  draft: number
  paused: number
  inactive: number
}

export type GetCampaignSummaryResponse =
  IAxiosResponse<GetCampaignSummaryResponseData>

export interface GetCampaignResponseData {
  campaign: Campaign
}

export type GetCampaignResponse = IAxiosResponse<GetCampaignResponseData>

export interface CreateCampaignRequest {
  campaignName: string
  description?: string
  statusId?: number
}

export interface CreateCampaignResponseData {
  campaign: Campaign
}

export type CreateCampaignResponse = IAxiosResponse<CreateCampaignResponseData>

export interface UpdateCampaignRequest {
  campaignId: number
  campaignName: string
  description?: string
  statusId?: number
}

export interface UpdateCampaignResponseData {
  campaign: Campaign
}

export type UpdateCampaignResponse = IAxiosResponse<UpdateCampaignResponseData>

export interface DeleteCampaignResponseData {
  success: boolean
}

export type DeleteCampaignResponse = IAxiosResponse<DeleteCampaignResponseData>
