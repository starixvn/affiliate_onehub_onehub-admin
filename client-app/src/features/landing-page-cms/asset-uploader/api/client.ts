import { apiClient } from '@/lib/api/client'
import type {
  DeleteAssetResponse,
  GetAssetListRequest,
  GetAssetListResponse,
  CreateAssetResponse,
  UpdateAssetRequest,
  UpdateAssetResponse,
  CreateAssetRequest,
  GetAssetDetailResponse,
  GetAssetFiltersResponse,
  UpdateAssetsStatusResponse,
} from '../types'

export const assetUploaderApi = {
  async getAssetList(
    params: GetAssetListRequest
  ): Promise<GetAssetListResponse> {
    const response = await apiClient.post<GetAssetListResponse>(
      '/asset-uploader/list',
      params
    )
    return response.data
  },

  async getAssetDetail(mediaId: number): Promise<GetAssetDetailResponse> {
    const response = await apiClient.get<GetAssetDetailResponse>(
      '/asset-uploader/detail',
      { params: { mediaId } }
    )
    return response.data
  },

  async createAsset(data: CreateAssetRequest): Promise<CreateAssetResponse> {
    try {
      const formData = new FormData()
      formData.append('targetCountryCode', data.targetCountryCode)
      formData.append('languageCode', data.languageCode)

      data.moduleRows.forEach((moduleRow, index) => {
        formData.append(
          `moduleRows[${index}]`,
          moduleRow.module
        )
        moduleRow.files.forEach((file) => {
          formData.append(`${moduleRow.module}`, file)
        })
      })

      const response = await apiClient.post<CreateAssetResponse>(
        '/asset-uploader/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data
    } catch (error: any) {
      return {
        errorCode: error?.errorCode || 1,
        errorMessage:
          error?.message || error?.errorMessage || 'Create asset failed',
        result: null,
      } as unknown as CreateAssetResponse
    }
  },

  async deleteAsset(mediaIds: string): Promise<DeleteAssetResponse> {
    try {
      const response = await apiClient.delete<DeleteAssetResponse>(
        `/asset-uploader/delete/${mediaIds}`
      )
      return response.data
    } catch (error: any) {
      return {
        errorCode: error?.errorCode || 1,
        errorMessage:
          error?.message || error?.errorMessage || 'Delete asset failed',
        result: null,
      } as unknown as DeleteAssetResponse
    }
  },

  async deleteAssets(mediaIds: string): Promise<DeleteAssetResponse> {
    try {
      const response = await apiClient.delete<DeleteAssetResponse>(
        `/asset-uploader/delete/${mediaIds}`
      )
      return response.data
    } catch (error: any) {
      return {
        errorCode: error?.errorCode || 1,
        errorMessage:
          error?.message || error?.errorMessage || 'Delete assets failed',
        result: null,
      } as unknown as DeleteAssetResponse
    }
  },

  async updateAsset(data: UpdateAssetRequest): Promise<UpdateAssetResponse> {
    try {
      const formData = new FormData()
      formData.append('mediaId', data.mediaId.toString())
      formData.append('moduleId', data.moduleId.toString())
      formData.append('targetCountryCode', data.targetCountryCode)
      formData.append('languageCode', data.languageCode)
      formData.append('inputFileName', data.inputFileName ?? '')
      formData.append('inputMediaName', data.inputMediaName ?? '')
      formData.append('file', data.file ?? new File([], ''))

      const response = await apiClient.post<UpdateAssetResponse>(
        '/asset-uploader/update',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data
    } catch (error: any) {
      return {
        errorCode: error?.errorCode || 1,
        errorMessage:
          error?.message || error?.errorMessage || 'Update asset failed',
        result: null,
      } as unknown as UpdateAssetResponse
    }
  },

  async updateAssetsStatus(
    ids: string,
    statusId: number
  ): Promise<UpdateAssetsStatusResponse> {
    try {
      const response = await apiClient.post<UpdateAssetsStatusResponse>(
        '/asset-uploader/status',
        { mediaIds: ids, statusId }
      )
      return response.data
    } catch (error: any) {
      return {
        errorCode: error?.errorCode || 1,
        errorMessage:
          error?.message ||
          error?.errorMessage ||
          'Update assets status failed',
        result: null,
      } as unknown as UpdateAssetsStatusResponse
    }
  },

  async getAssetFilters(): Promise<GetAssetFiltersResponse> {
    const response = await apiClient.get<GetAssetFiltersResponse>(
      '/asset-uploader/filters'
    )
    return response.data
  },
}
