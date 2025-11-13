import {
  mediaDetailSchema,
  type MediaDetail,
  type ValidationErrors,
  type TouchedFields,
  type FormWithFiles,
  type FormFile,
  DEFAULT_FILE_UPLOAD_CONFIG,
} from '@/features/landing-page-cms/shared'
import type {} from '@/features/landing-page-cms/shared'

export const REGISTER_FORM_MODULE_ID = 9

export const TRANSLATION_KEY = 'registration-form-management'

export const registerFormDetailSchema = mediaDetailSchema
export type RegisterFormDetail = MediaDetail

export type RegistrationFormWithFiles = FormWithFiles

export type { ValidationErrors, TouchedFields, FormWithFiles, FormFile }

export const ALLOWED_FILE_TYPES = DEFAULT_FILE_UPLOAD_CONFIG.allowedFileTypes
export const MAX_FILE_SIZE_MB = DEFAULT_FILE_UPLOAD_CONFIG.maxFileSizeMB
export const MAX_FILES_PER_MODULE = DEFAULT_FILE_UPLOAD_CONFIG.maxFilesPerModule
export const MAX_FILE_NAME_LENGTH = DEFAULT_FILE_UPLOAD_CONFIG.maxFileNameLength
export const MAX_FORM_NAME_LENGTH =
  DEFAULT_FILE_UPLOAD_CONFIG.maxFormNameLength || 200
export const regSpecialCharacters =
  DEFAULT_FILE_UPLOAD_CONFIG.regSpecialCharacters
