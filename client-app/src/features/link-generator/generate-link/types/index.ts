import type { IAxiosResponse } from '@/lib/types/common'

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
  countryId: number
  countryName: string
  countryCode: string
}

export type CampaignInfo = {
  campaignId: number
  campaignCode: string
  campaignName: string
}

export type LandingPageOption = {
  pageName: string
  isComponent: boolean
  category: string
}

export type LandingPageGroup = {
  groupLabel: string
  options: LandingPageOption[]
}

export interface LinkGeneratorOptions {
  campaigns?: CampaignInfo[]
  countries?: TargetCountry[]
  languages?: DropdownOption[]
  groups?: ComponentInfo[]
  events?: ComponentInfo[]
  channels?: ComponentInfo[]
  types?: ComponentInfo[]
  agencies?: ComponentInfo[]
  landingPages?: LandingPageGroup[]
  domainNames?: DropdownOption[]
  shortLinkNames?: DropdownOption[]
}

export type GetLinkGeneratorOptionsResponse = IAxiosResponse<LinkGeneratorOptions>

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
  shortLinkName: string
  shortLinkValue: string
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

