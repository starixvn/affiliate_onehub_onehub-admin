import {
  mediaDetailSchema,
  type MediaDetail,
  type ModuleWithFiles,
  type ValidationErrors,
  type TouchedFields,
  createFileUploadConfig,
  DEFAULT_FILE_UPLOAD_CONFIG,
} from '@/features/landing-page-cms/shared'

export const TRANSLATION_KEY = 'asset-uploader'

export const assetDetailSchema = mediaDetailSchema
export type AssetDetail = MediaDetail

export type AssetModuleWithFiles = ModuleWithFiles<File>
export type { ValidationErrors, TouchedFields, ModuleWithFiles }

export const createAssetUploadConfig = (apiConfig?: {
  maximumFiles?: number
  maxFileSize?: number
  allowedExtensions?: string[]
}) => createFileUploadConfig(apiConfig)

export const ALLOWED_FILE_TYPES = DEFAULT_FILE_UPLOAD_CONFIG.allowedFileTypes
export const MAX_FILE_SIZE_MB = DEFAULT_FILE_UPLOAD_CONFIG.maxFileSizeMB
export const MAX_FILES_PER_MODULE = DEFAULT_FILE_UPLOAD_CONFIG.maxFilesPerModule
export const regSpecialCharacters =
  DEFAULT_FILE_UPLOAD_CONFIG.regSpecialCharacters
export const MAX_FILE_NAME_LENGTH = DEFAULT_FILE_UPLOAD_CONFIG.maxFileNameLength
