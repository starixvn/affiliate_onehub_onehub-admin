import type { IAxiosResponse } from '@/lib/api/types'
import type { IPaginatedResponse } from '@/lib/types/common'
import type { RegisterFormDetail, FormWithFiles } from '../data/schema'

export interface GetRegisterFormListRequest {
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

export type GetRegisterFormListResponseData =
  IPaginatedResponse<RegisterFormDetail>

export type GetRegisterFormListResponse =
  IAxiosResponse<GetRegisterFormListResponseData>

export interface GetRegisterFormDetailResponseData {
  assetDetail: RegisterFormDetail
}

export type GetRegisterFormDetailResponse =
  IAxiosResponse<GetRegisterFormDetailResponseData>

export interface CreateRegisterFormRequest {
  targetCountryCode: string
  languageCode: string
  moduleRows: FormWithFiles[]
}

export interface CreateRegisterFormResponseData {
  asset: RegisterFormDetail
}

export type CreateRegisterFormResponse =
  IAxiosResponse<CreateRegisterFormResponseData>

export interface UpdateRegisterFormRequest {
  mediaId: number
  moduleId: number
  targetCountryCode: string
  languageCode: string
  file?: File
  inputFileName?: string
  inputMediaName?: string
}

export interface UpdateRegisterFormResponseData {
  asset: RegisterFormDetail
}

export type UpdateRegisterFormResponse =
  IAxiosResponse<UpdateRegisterFormResponseData>

export interface DeleteRegisterFormResponseData {
  success: boolean
}

export type DeleteRegisterFormResponse =
  IAxiosResponse<DeleteRegisterFormResponseData>

export interface UpdateRegisterFormsStatusResponseData {
  success: boolean
}

export type UpdateRegisterFormsStatusResponse =
  IAxiosResponse<UpdateRegisterFormsStatusResponseData>

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
  languageCode: string
}

export interface Language {
  languageCode: string
  languageName: string
  targetCountryCode: string
}

export interface RegisterFormStatus {
  statusId: number
  status: string
}

export interface GetRegisterFormFiltersData {
  modules: Array<Module>
  targetCountries: Array<Country>
  languages: Array<Language>
  statusInfos: Array<RegisterFormStatus>
  landingPageUrl: string
  bannerRootUrl: string
  maximumFiles: number
  maxFileSize: number
  allowedExtensions: Array<string>
}

export type GetRegisterFormFiltersResponse =
  IAxiosResponse<GetRegisterFormFiltersData>
