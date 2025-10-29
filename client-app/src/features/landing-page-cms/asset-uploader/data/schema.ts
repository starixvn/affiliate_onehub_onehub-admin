import z from 'zod'

export const assetDetailSchema = z.object({
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

export type AssetDetail = z.infer<typeof assetDetailSchema>

export interface ModuleWithFiles {
  module: string
  files: File[]
}

export interface ValidationErrors {
  country?: string
  language?: string
  modules: { [key: number]: string }
  files?: {
    uploadLimitExceeded?: string
    invalidFileTypes?: string
    fileSizeExceeded?: string
    duplicateFileNames?: string
  }
}

export interface TouchedFields {
  country: boolean
  language: boolean
  modules: { [key: number]: boolean }
}

export const ALLOWED_FILE_TYPES = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
] as const
export const MAX_FILE_SIZE_MB = 3
export const MAX_FILES_PER_MODULE = 50
