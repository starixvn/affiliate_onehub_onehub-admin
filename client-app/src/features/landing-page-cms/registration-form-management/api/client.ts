import { apiClient } from '@/lib/api/client'
import { createApiErrorResponse } from '@/features/landing-page-cms/shared'
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
  CreateMediaResponseData,
  DeleteMediaResponseData,
  UpdateMediaResponseData,
  UpdateMediaStatusResponseData,
} from '@/features/landing-page-cms/shared'
import { REGISTER_FORM_MODULE_ID } from '../data/schema'

export const registrationFormManagementApi = {
  async getMediaList(
    params: GetMediaListRequest
  ): Promise<GetMediaListResponse> {
    const response = await apiClient.post<GetMediaListResponse>(
      '/registration-form/list',
      params
    )
    return response.data
  },

  async getMediaDetail(mediaId: number): Promise<GetMediaDetailResponse> {
    const response = await apiClient.get<GetMediaDetailResponse>(
      '/registration-form/detail',
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
        '/registration-form/upload',
        formData,
        {
          headers: {
            'Content-Type': undefined,
          },
        }
      )
      return response.data
    } catch (error: unknown) {
      return createApiErrorResponse<CreateMediaResponseData>(
        error
      ) as CreateMediaResponse
    }
  },

  async deleteMedias(mediaIds: string): Promise<DeleteMediaResponse> {
    try {
      const response = await apiClient.delete<DeleteMediaResponse>(
        '/registration-form/delete',
        { data: { mediaIds } }
      )
      return response.data
    } catch (error: unknown) {
      return createApiErrorResponse<DeleteMediaResponseData>(
        error
      ) as DeleteMediaResponse
    }
  },

  async updateMedia(data: UpdateMediaRequest): Promise<UpdateMediaResponse> {
    try {
      const formData = new FormData()
      formData.append('mediaId', data.mediaId.toString())
      formData.append('moduleId', data.moduleId.toString())
      formData.append('targetCountryCode', data.targetCountryCode)
      formData.append('languageCode', data.languageCode)
      formData.append('inputFileName', data.inputFileName)
      formData.append('inputMediaName', data.inputMediaName)
      if (data.file) formData.append('file', data.file)

      const response = await apiClient.post<UpdateMediaResponse>(
        '/registration-form/update',
        formData,
        {
          headers: {
            'Content-Type': undefined,
          },
        }
      )
      return response.data
    } catch (error: unknown) {
      return createApiErrorResponse<UpdateMediaResponseData>(
        error
      ) as UpdateMediaResponse
    }
  },

  async updateMediaStatus(
    ids: string,
    statusId: number
  ): Promise<UpdateMediaStatusResponse> {
    try {
      const response = await apiClient.post<UpdateMediaStatusResponse>(
        '/registration-form/status',
        { mediaIds: ids, statusId }
      )
      return response.data
    } catch (error: unknown) {
      return createApiErrorResponse<UpdateMediaStatusResponseData>(
        error
      ) as UpdateMediaStatusResponse
    }
  },

  async getMediaFilters(): Promise<GetMediaFiltersResponse> {
    const response = await apiClient.get<GetMediaFiltersResponse>(
      '/registration-form/filters'
    )
    return response.data
  },
}
