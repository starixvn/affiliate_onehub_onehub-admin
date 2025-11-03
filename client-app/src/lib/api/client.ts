import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { tokenService } from '@/lib/auth/token-service'
import type { IAxiosResponse } from '@/lib/api/types'

export interface IAxiosErrorData extends Error {
  status?: number
  statusText?: string
  errorCode?: number
  data?: unknown
}

export const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback)
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token))
  refreshSubscribers = []
}

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenService.getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response: AxiosResponse<IAxiosResponse>) => {
    const { data } = response

    if (data?.errorCode && data.errorCode !== 0) {
      const error: IAxiosErrorData = new Error(data.errorMessage)
      error.message = data.errorMessage || 'An error occurred'
      error.status = response.status
      error.statusText = response.statusText
      error.errorCode = data.errorCode
      error.data = data.data
      return Promise.reject(error)
    }

    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    const isRefreshEndpoint = originalRequest.url?.includes('/auth/refresh')

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            resolve(apiClient(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const response = await apiClient.post('/auth/refresh')

        const { data } = response
        if (data?.errorCode === 0 && data.data?.accessToken) {
          const newToken = data.data.accessToken
          tokenService.setAccessToken(newToken)
          onRefreshed(newToken)

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
          }

          return apiClient(originalRequest)
        }

        throw new Error('Token refresh failed')
      } catch (refreshError) {
        tokenService.clearTokens()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)
