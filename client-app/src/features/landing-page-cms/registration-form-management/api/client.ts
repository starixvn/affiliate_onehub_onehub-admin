import { apiClient } from '@/lib/api/client'
import type {
  DeleteMediaResponse,
  GetMediaListRequest,
  GetMediaListResponse,
  CreateMediaResponse,
  UpdateMediaRequest,
  UpdateMediaResponse,
  CreateMediaRequest,
  FormFile,
  GetMediaDetailResponse,
  GetMediaFiltersResponse,
  UpdateMediaStatusResponse,
} from '@/features/landing-page-cms/shared'
import { REGISTER_FORM_MODULE_ID } from '../data/schema'

export const registrationFormManagementApi = {
  async getMediaList(
    params: GetMediaListRequest
  ): Promise<GetMediaListResponse> {
    const response = await apiClient.post<GetMediaListResponse>(
      '/asset-uploader/list',
      params
    )
    return response.data
  },

  async getMediaDetail(mediaId: number): Promise<GetMediaDetailResponse> {
    const response = await apiClient.get<GetMediaDetailResponse>(
      '/asset-uploader/detail',
      { params: { mediaId } }
    )
    return response.data
  },

  async createMedia(data: CreateMediaRequest): Promise<CreateMediaResponse> {
    try {
      const formData = new FormData()
      formData.append('targetCountryCode', data.targetCountryCode)
      formData.append('languageCode', data.languageCode)

      data.moduleRows.forEach((moduleRow, index) => {
        const inputMediaNames = new Array<string>()
        formData.append(
          `moduleRows[${index}]`,
          REGISTER_FORM_MODULE_ID.toString()
        )

        moduleRow.files.forEach((formFile) => {
          const typedFormFile = formFile as FormFile
          inputMediaNames.push(typedFormFile.formName)
          formData.append(
            `${REGISTER_FORM_MODULE_ID.toString()}`,
            typedFormFile.file
          )
        })
        formData.append(`inputMediaNames[${index}]`, inputMediaNames.join('|'))
      })

      const response = await apiClient.post<CreateMediaResponse>(
        '/asset-uploader/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data
    } catch (error: unknown) {
      const err = error as {
        errorCode?: number
        message?: string
        errorMessage?: string
      }
      return {
        errorCode: err.errorCode || 1,
        errorMessage:
          err.message || err.errorMessage || 'Create register form failed',
        result: null,
      } as unknown as CreateMediaResponse
    }
  },

  async deleteMedia(mediaIds: string): Promise<DeleteMediaResponse> {
    try {
      const response = await apiClient.delete<DeleteMediaResponse>(
        `/asset-uploader/delete/${mediaIds}`
      )
      return response.data
    } catch (error: unknown) {
      const err = error as {
        errorCode?: number
        message?: string
        errorMessage?: string
      }
      return {
        errorCode: err.errorCode || 1,
        errorMessage:
          err.message || err.errorMessage || 'Delete register form failed',
        result: null,
      } as unknown as DeleteMediaResponse
    }
  },

  async deleteMedias(mediaIds: string): Promise<DeleteMediaResponse> {
    try {
      const response = await apiClient.delete<DeleteMediaResponse>(
        `/asset-uploader/delete/${mediaIds}`
      )
      return response.data
    } catch (error: unknown) {
      const err = error as {
        errorCode?: number
        message?: string
        errorMessage?: string
      }
      return {
        errorCode: err.errorCode || 1,
        errorMessage:
          err.message || err.errorMessage || 'Delete register forms failed',
        result: null,
      } as unknown as DeleteMediaResponse
    }
  },

  async updateMedia(data: UpdateMediaRequest): Promise<UpdateMediaResponse> {
    try {
      const formData = new FormData()
      formData.append('mediaId', data.mediaId.toString())
      formData.append('moduleId', data.moduleId.toString())
      formData.append('targetCountryCode', data.targetCountryCode)
      formData.append('languageCode', data.languageCode)
      formData.append('inputFileName', data.inputFileName ?? '')
      formData.append('inputMediaName', data.inputMediaName ?? '')
      formData.append('file', data.file ?? new File([], ''))

      const response = await apiClient.post<UpdateMediaResponse>(
        '/asset-uploader/update',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data
    } catch (error: unknown) {
      const err = error as {
        errorCode?: number
        message?: string
        errorMessage?: string
      }
      return {
        errorCode: err.errorCode || 1,
        errorMessage:
          err.message || err.errorMessage || 'Update register form failed',
        result: null,
      } as unknown as UpdateMediaResponse
    }
  },

  async updateMediaStatus(
    ids: string,
    statusId: number
  ): Promise<UpdateMediaStatusResponse> {
    try {
      const response = await apiClient.post<UpdateMediaStatusResponse>(
        '/asset-uploader/status',
        { mediaIds: ids, statusId }
      )
      return response.data
    } catch (error: unknown) {
      const err = error as {
        errorCode?: number
        message?: string
        errorMessage?: string
      }
      return {
        errorCode: err.errorCode || 1,
        errorMessage:
          err.message ||
          err.errorMessage ||
          'Update register forms status failed',
        result: null,
      } as unknown as UpdateMediaStatusResponse
    }
  },

  async getMediaFilters(): Promise<GetMediaFiltersResponse> {
    const response = await apiClient.get<GetMediaFiltersResponse>(
      '/asset-uploader/filters'
    )
    return response.data
  },
}
