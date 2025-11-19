import z from 'zod'

export const registerFormDetailSchema = z.object({
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

export type RegisterFormDetail = z.infer<typeof registerFormDetailSchema>

export interface FormWithFiles {
  module: string
  files: FormFile[]
}

export interface FormFile {
  file: File
  formName: string,
  fileName: string
}

export interface ValidationErrors {
  country?: string
  language?: string
  mediaInUse?: string
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
  formNames: { [key: number]: boolean }
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
export const MAX_FORM_NAME_LENGTH = 200
export const regSpecialCharacters = '[\\/:*?"<>|#%&+]'
