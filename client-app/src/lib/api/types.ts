export interface IAxiosResponse<T = unknown> {
  data: T
  errorCode: number
  errorMessage: string
}
