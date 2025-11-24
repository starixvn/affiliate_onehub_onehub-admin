import type { IAxiosResponse } from '@/lib/api/types'
import type { IPaginatedResponse } from '@/lib/types/common'
import type { LandingPage } from '../data/schema'

export interface GetLandingPagesRequest {
  search?: string
  statusIds?: string
  countryCodes?: string
  languageCodes?: string
  fromDate?: string
  toDate?: string
  pageIndex?: number
  pageSize?: number
}

export type GetLandingPagesResponseData = IPaginatedResponse<LandingPage>

export type GetLandingPagesResponse = IAxiosResponse<GetLandingPagesResponseData>

export interface GetLandingPageSummaryResponseData {
  total: number
  draft: number
  active: number
  inactive: number
}

export interface GetPageManagementDashboardRequest {}

export type GetLandingPageSummaryResponse =
  IAxiosResponse<GetLandingPageSummaryResponseData>

export interface GetLandingPageResponseData {
  landingPage: LandingPage
}

export type GetLandingPageResponse = IAxiosResponse<GetLandingPageResponseData>

export interface DeleteBatchLandingPageRequest {
  pageIds: string
}

export type DeleteLandingPageResponse = IAxiosResponse<null>

export interface UpdateBatchLandingPageStatusRequest {
  pageIds: string
  statusId: number
}

export type UpdateBatchLandingPageStatusResponse = IAxiosResponse<null>

export interface Country {
  targetCountryCode: string
  targetCountryName: string
}

export interface Language {
  languageCode: string
  languageName: string
  targetCountryCode: string
}

export interface PageStatus {
  statusId: number
  status: string
}

export interface GetPageFiltersData {
  targetCountries: Array<Country>
  languages: Array<Language>
  statusInfos: Array<PageStatus>
  landingPageUrl: string
  today: Date
  defaultFromDate: Date
  defaultToDate: Date
}

export type GetPageFiltersResponse = IAxiosResponse<GetPageFiltersData>
