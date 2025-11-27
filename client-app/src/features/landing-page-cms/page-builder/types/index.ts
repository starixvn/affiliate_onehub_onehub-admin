import type { IAxiosResponse } from '@/lib/api/types'

export interface DropdownOption {
  [key: string]: string | number | boolean | null | undefined
}

export type TargetCountry = {
  targetCountryCode: string
  targetCountryName: string
  languageCode: string
  languageName: string
  shortedLanguageCode: string
  status: number
}

export type Market = {
  marketId: string
  marketName: string
  displayName: string
  shortedCode: string
}

export type CampaignInfo = {
  campaignId: number
  campaignCode: string
  campaignName: string
}

export type Module = {
  moduleId: number
  moduleName: string
  moduleType: number
  isMultipleUpload: boolean
  isRequired: boolean
  isUnique: boolean
}

export type MediaSource = {
  mediaId: number
  mediaName: string
  fileName: string
  dimension: string
  moduleId?: number
}

export interface PageBuilderDetails {
  pageName: string
  pageCode: string
  campaignId: number
  targetCountryCode: string
  languageCode: string
  isPreview: boolean
  statusId: number
  pageId?: number
  moduleComponentSettings?: ModuleComponentItem[]
}

export interface ModuleComponentItem {
  moduleId: number
  mediaId?: number | null
  extraInfo?: string
  orderId: number
}

export interface CreatePageBuilderRequest {
  pageName: string
  pageCode: string
  campaignId: number
  targetCountryCode: string
  languageCode: string
  isPreview: boolean
  statusId: number
  pageId?: number
  moduleComponentSettings?: ModuleComponentItem[]
}

export interface CreatePageBuilderResult {
  pageId: number,
  landingPageUrl: string
}

export type CreatePageBuilderResponse = IAxiosResponse<CreatePageBuilderResult>

