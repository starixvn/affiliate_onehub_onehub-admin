import z from 'zod'
import type { IAxiosResponse } from '@/lib/api/types'
import type { IPaginatedResponse } from '@/lib/types/common'

export const mediaDetailSchema = z.object({
  mediaId: z.number(),
  mediaName: z.string(),
  fileName: z.string(),
  moduleId: z.number(),
  moduleName: z.string(),
  dimension: z.string(),
  statusId: z.number(),
  targetCountryCode: z.string(),
  targetCountryName: z.string(),
  languageCode: z.string(),
  marketId: z.string(),
  marketName: z.string(),
  createdDate: z.string(),
  createdBy: z.string(),
  updatedDate: z.string(),
  updatedBy: z.string(),
  isMediaIdInUse: z.boolean(),
})

export type MediaDetail = z.infer<typeof mediaDetailSchema>

export interface BaseFile {
  file: File
  fileName: string
}

export interface FormFile extends BaseFile {
  formName: string
}

export type FileItem = File | BaseFile | FormFile

export interface ModuleWithFiles<T extends FileItem = BaseFile> {
  module: string
  files: T[]
}

export interface FormWithFiles<T extends FileItem = FormFile> {
  module: string
  files: T[]
}

export interface ValidationErrors {
  country?: string
  language?: string
  mediaInUse?: string
  modules?: { [key: number]: string }
  modulesWithoutFiles?: string
  formNames?: { [key: number]: string }
  files?: {
    uploadLimitExceeded?: string
    invalidFileTypes?: string
    fileSizeExceeded?: string
    duplicateFileNames?: string
    fileNameInvalidChars?: string
    fileNameTooLong?: string
    formNameRequired?: string
    formNameTooLong?: string
    formNameInvalidChars?: string
  }
}

export interface TouchedFields {
  country: boolean
  language: boolean
  modules?: { [key: number]: boolean }
  formNames?: { [key: number]: boolean }
}

export interface FileUploadConfig {
  allowedFileTypes: readonly string[]
  maxFileSizeMB: number
  maxFilesPerModule: number
  maxFileNameLength: number
  maxFormNameLength?: number
  regSpecialCharacters: string
}

export const DEFAULT_FILE_UPLOAD_CONFIG: FileUploadConfig = {
  allowedFileTypes: ['.jpg', '.jpeg', '.png', '.gif', '.webp'] as const,
  maxFileSizeMB: 3,
  maxFilesPerModule: 50,
  maxFileNameLength: 50,
  maxFormNameLength: 200,
  regSpecialCharacters: '[\\/:*?"<>|#%&+]',
}

export type ValidationMode = 'modules' | 'formNames'

export interface GetMediaListRequest {
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

export type GetMediaListResponseData = IPaginatedResponse<MediaDetail>

export type GetMediaListResponse = IAxiosResponse<GetMediaListResponseData>

export interface GetMediaDetailResponseData {
  mediaDetail: MediaDetail
}

export type GetMediaDetailResponse = IAxiosResponse<GetMediaDetailResponseData>

export interface CreateMediaRequest {
  targetCountryCode: string
  languageCode: string
  moduleRows: ModuleWithFiles[]
}

export interface CreateMediaResponseData {
  media: MediaDetail
}

export type CreateMediaResponse = IAxiosResponse<CreateMediaResponseData>

export interface UpdateMediaRequest {
  mediaId: number
  moduleId: number
  targetCountryCode: string
  languageCode: string
  file?: File
  inputFileName?: string
  inputMediaName?: string
}

export interface UpdateMediaResponseData {
  media: MediaDetail
}

export type UpdateMediaResponse = IAxiosResponse<UpdateMediaResponseData>

export interface DeleteMediaResponseData {
  success: boolean
}

export type DeleteMediaResponse = IAxiosResponse<DeleteMediaResponseData>

export interface UpdateMediaStatusResponseData {
  success: boolean
}

export type UpdateMediaStatusResponse =
  IAxiosResponse<UpdateMediaStatusResponseData>

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

export interface MediaStatus {
  statusId: number
  status: string
}

export interface GetMediaFiltersData {
  modules: Array<Module>
  targetCountries: Array<Country>
  languages: Array<Language>
  statusInfos: Array<MediaStatus>
  landingPageUrl: string
  bannerRootUrl: string
  maximumFiles: number
  maxFileSize: number
  allowedExtensions: Array<string>
}

export type GetMediaFiltersResponse = IAxiosResponse<GetMediaFiltersData>

export type DialogType =
  | 'upload'
  | 'edit'
  | 'delete'
  | 'delete-bulk'
  | 'status-change'
