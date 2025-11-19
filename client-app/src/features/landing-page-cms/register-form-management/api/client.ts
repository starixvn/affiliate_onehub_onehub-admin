import { apiClient } from '@/lib/api/client'
import { REGISTER_FORM_MODULE_ID } from '../data/constants'
import type {
  DeleteRegisterFormResponse,
  GetRegisterFormListRequest,
  GetRegisterFormListResponse,
  CreateRegisterFormResponse,
  UpdateRegisterFormRequest,
  UpdateRegisterFormResponse,
  CreateRegisterFormRequest,
  GetRegisterFormDetailResponse,
  GetRegisterFormFiltersResponse,
  UpdateRegisterFormsStatusResponse,
} from '../types'

export const registerFormManagementApi = {
  async getRegisterFormList(
    params: GetRegisterFormListRequest
  ): Promise<GetRegisterFormListResponse> {
    const response = await apiClient.post<GetRegisterFormListResponse>(
      '/asset-uploader/list',
      params
    )
    return response.data
  },

  async getRegisterFormDetail(
    mediaId: number
  ): Promise<GetRegisterFormDetailResponse> {
    const response = await apiClient.get<GetRegisterFormDetailResponse>(
      '/asset-uploader/detail',
      { params: { mediaId } }
    )
    return response.data
  },

  async createRegisterForm(
    data: CreateRegisterFormRequest
  ): Promise<CreateRegisterFormResponse> {
    try {
      const formData = new FormData()
      formData.append('targetCountryCode', data.targetCountryCode)
      formData.append('languageCode', data.languageCode)

      data.moduleRows.forEach((moduleRow, index) => {
        let inputMediaNames = new Array<string>()
        formData.append(
          `moduleRows[${index}]`,
          REGISTER_FORM_MODULE_ID.toString()
        )

        moduleRow.files.forEach((formFile) => {
          inputMediaNames.push(formFile.formName)
          formData.append(
            `${REGISTER_FORM_MODULE_ID.toString()}`,
            formFile.file
          )
        })
        formData.append(`inputMediaNames[${index}]`, inputMediaNames.join('|'))
      })

      const response = await apiClient.post<CreateRegisterFormResponse>(
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
      } as unknown as CreateRegisterFormResponse
    }
  },

  async deleteRegisterForm(
    mediaIds: string
  ): Promise<DeleteRegisterFormResponse> {
    try {
      const response = await apiClient.delete<DeleteRegisterFormResponse>(
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
      } as unknown as DeleteRegisterFormResponse
    }
  },

  async deleteRegisterForms(
    mediaIds: string
  ): Promise<DeleteRegisterFormResponse> {
    try {
      const response = await apiClient.delete<DeleteRegisterFormResponse>(
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
      } as unknown as DeleteRegisterFormResponse
    }
  },

  async updateRegisterForm(
    data: UpdateRegisterFormRequest
  ): Promise<UpdateRegisterFormResponse> {
    try {
      const formData = new FormData()
      formData.append('mediaId', data.mediaId.toString())
      formData.append('moduleId', data.moduleId.toString())
      formData.append('targetCountryCode', data.targetCountryCode)
      formData.append('languageCode', data.languageCode)
      formData.append('inputFileName', data.inputFileName ?? '')
      formData.append('inputMediaName', data.inputMediaName ?? '')
      formData.append('file', data.file ?? new File([], ''))

      const response = await apiClient.post<UpdateRegisterFormResponse>(
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
      } as unknown as UpdateRegisterFormResponse
    }
  },

  async updateRegisterFormsStatus(
    ids: string,
    statusId: number
  ): Promise<UpdateRegisterFormsStatusResponse> {
    try {
      const response = await apiClient.post<UpdateRegisterFormsStatusResponse>(
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
      } as unknown as UpdateRegisterFormsStatusResponse
    }
  },

  async getRegisterFormFilters(): Promise<GetRegisterFormFiltersResponse> {
    const response = await apiClient.get<GetRegisterFormFiltersResponse>(
      '/asset-uploader/filters'
    )
    return response.data
  },
}
