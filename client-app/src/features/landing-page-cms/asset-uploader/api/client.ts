import { apiClient, type IAxiosErrorData } from '@/lib/api/client'
import type {
  DeleteMediaResponse,
  GetMediaListRequest,
  GetMediaListResponse,
  CreateMediaResponse,
  UpdateMediaRequest,
  UpdateMediaResponse,
  CreateMediaRequest,
  GetMediaDetailResponse,
  GetMediaFiltersResponse,
  UpdateMediaStatusResponse,
  BaseFile,
} from '@/features/landing-page-cms/shared'

export const assetUploaderApi = {
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
        formData.append(`moduleRows[${index}]`, moduleRow.module)
        formData.append(`inputMediaNames[${index}]`, '')
        moduleRow.files.forEach((baseFile: BaseFile) => {
          formData.append(`${moduleRow.module}`, baseFile.file)
        })
      })

      const response = await apiClient.post<CreateMediaResponse>(
        '/asset-uploader/upload',
        formData,
        {
          headers: {
            'Content-Type': undefined,
          },
        }
      )
      return response.data
    } catch (error: unknown) {
      const err = error as IAxiosErrorData
      return {
        errorCode: err.errorCode || 1,
        errorMessage: null,
        result: null,
      } as unknown as CreateMediaResponse
    }
  },

  async deleteMedias(mediaIds: string): Promise<DeleteMediaResponse> {
    try {
      const response = await apiClient.delete<DeleteMediaResponse>(
        '/asset-uploader/delete',
        { data: { mediaIds } }
      )
      return response.data
    } catch (error: unknown) {
      const err = error as IAxiosErrorData
      return {
        errorCode: err.errorCode || 1,
        errorMessage: null,
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
      formData.append('inputFileName', data.inputFileName)
      formData.append('inputMediaName', data.inputFileName)
      if (data.file) formData.append('file', data.file)

      const response = await apiClient.post<UpdateMediaResponse>(
        '/asset-uploader/update',
        formData,
        {
          headers: {
            'Content-Type': undefined,
          },
        }
      )
      return response.data
    } catch (error: unknown) {
      const err = error as IAxiosErrorData
      return {
        errorCode: err.errorCode || 1,
        errorMessage: null,
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
      const err = error as IAxiosErrorData
      return {
        errorCode: err.errorCode || 1,
        errorMessage: null,
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
