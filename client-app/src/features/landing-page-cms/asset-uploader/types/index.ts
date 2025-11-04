import type { IAxiosResponse, IPaginatedResponse } from '@/lib/types/common'
import type { AssetDetail, ModuleWithFiles } from '../data/schema'

export interface GetAssetListRequest {
  moduleIds?: string
  targetCountrycodes: string
  languageCodes: string
  status: number
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
  moduleId: number
  targetCountryCode: string
  languageCode: string
  files?: File[]
  inputFileNames?: string[]
  inputMediaNames?: string[]
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

export interface GetAssetFiltersResponseData {
  moduleList: Array<Module>
  targetCountryList: Array<Country>
  allLanguagesInSystem: Array<Language>
  statusList: Array<AssetStatus>
  landingPageUrl: string
  bannerRootUrl: string
  maximumFiles: number
  maxFileSize: number
  allowedExtensions: Array<string>
}
