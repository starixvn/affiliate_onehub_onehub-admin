import type { IAxiosResponse } from '@/lib/api/types'

export interface DropdownOption {
  [key: string]: string | number | boolean | null | undefined
}

export type ComponentInfo = {
  componentId: number
  componentName: string
  componentCode: string
  componentTypeId: number
  statusId: number
  status: string
}

export type TargetCountry = {
  targetCountryName: string
  targetCountryCode: string
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

export type LandingPageOption = {
  pageCode: string
  pageName: string
  isComponent: boolean
  category: string
  pageType: number
  targetCountryCode: number
  marketId: number
  campaignId: number
  campaignCode: string
}

export type LandingPageGroup = {
  groupLabel: string
  options: LandingPageOption[]
}

export type DomainInfo = {
  domainName: string
  domainType: number
  createdDate: string
  siteId: number
  score: number
}

export interface GenerateLinkFormData {
  linkName: string
  identifierCode: string
  campaign: string
  country: string
  language: string
  group: string
  event: string[]
  domainName: string
  domainNote: string
  shortDomain: string
  shortPath: string
  channel: string
  type: string
  agency: string
  landingPage: string
  note: string
}

export interface GenerateLinkRequest {
  formData: GenerateLinkFormData
}

export interface GeneratedLinkResult {
  fullLink: string
  shortLink: string
}

export type GenerateLinkResponse = IAxiosResponse<GeneratedLinkResult>

export interface InsertLinkRequest {
  linkName: string
  identifierCode?: string
  campaignId: number
  campaignCode: string
  countryCode: string
  marketId: string
  eventIds: string
  eventCodes: string
  groupId: number
  groupCode: string
  channelId: number
  channelCode: string
  agencyId: number
  agencyCode: string
  typeId: number
  typeCode: string
  landingPage: string
  pageType: number
  pageCode: string
  domainName: string
  domainNote: string
  shortDomain: string
  shortPath: string
  note?: string
}

export interface LinkGeneratedResult {
  idCode: string
  fullLink: string
  shortLink: string
}

export type InsertLinkResponse = IAxiosResponse<LinkGeneratedResult>

