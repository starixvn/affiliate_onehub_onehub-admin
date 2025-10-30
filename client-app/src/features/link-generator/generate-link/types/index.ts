import type { IAxiosResponse } from '@/lib/types/common'

export interface DropdownOption {
  value: string
  label: string
}

export interface LinkGeneratorOptions {
  campaigns: DropdownOption[]
  countries: DropdownOption[]
  languages: DropdownOption[]
  groups: DropdownOption[]
  events: DropdownOption[]
  channels: DropdownOption[]
  types: DropdownOption[]
  agencies: DropdownOption[]
  landingPages: DropdownOption[]
  domainNames: DropdownOption[]
  shortLinkNames: DropdownOption[]
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

