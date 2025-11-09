import type { IPaginatedResponse } from '@/lib/types/common'
import type { IAxiosResponse } from '@/lib/api/types'
import type { AssetDetail, ModuleWithFiles } from '../data/schema'

export interface GetAssetListRequest {
  moduleIds?: string
  targetCountrycodes: string
  languageCodes: string
  status: number
  currentStatus: number[]
  mediaId: number
  mediaName?: string
  pageIndex: number
  pageSize: number
}

export type GetAssetListResponseData = IPaginatedResponse<AssetDetail>

export type GetAssetListResponse = IAxiosResponse<GetAssetListResponseData>

export interface GetAssetDetailResponseData {
  assetDetail: AssetDetail
}

export type GetAssetDetailResponse = IAxiosResponse<GetAssetDetailResponseData>

export interface CreateAssetRequest {
  targetCountryCode: string
  languageCode: string
  moduleRows: ModuleWithFiles[]
}

export interface CreateAssetResponseData {
  asset: AssetDetail
}

export type CreateAssetResponse = IAxiosResponse<CreateAssetResponseData>

export interface UpdateAssetRequest {
  mediaId: number
  moduleId: number
  targetCountryCode: string
  languageCode: string
  file?: File
  inputFileName?: string
  inputMediaName?: string
}

export interface UpdateAssetResponseData {
  asset: AssetDetail
}

export type UpdateAssetResponse = IAxiosResponse<UpdateAssetResponseData>

export interface DeleteAssetResponseData {
  success: boolean
}

export type DeleteAssetResponse = IAxiosResponse<DeleteAssetResponseData>

export interface UpdateAssetsStatusResponseData {
  success: boolean
}

export type UpdateAssetsStatusResponse =
  IAxiosResponse<UpdateAssetsStatusResponseData>

export interface Module {
  moduleId: number
  moduleName: string
  moduleType: number
  isMultipleUpload: boolean
  isRequired: boolean
  isUnique: boolean
}
export interface Country {
  targetCountryCode: string
  targetCountryName: string
}

export interface Language {
  languageCode: string
  languageName: string
  targetCountryCode: string
}

export interface AssetStatus {
  statusId: number
  status: string
}

export interface GetAssetFiltersData {
  modules: Array<Module>
  targetCountries: Array<Country>
  languages: Array<Language>
  statusInfos: Array<AssetStatus>
  landingPageUrl: string
  bannerRootUrl: string
  maximumFiles: number
  maxFileSize: number
  allowedExtensions: Array<string>
}

export type GetAssetFiltersResponse = IAxiosResponse<GetAssetFiltersData>