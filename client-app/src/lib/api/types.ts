export interface IAxiosResponse<T> {
  data: T
  errorCode: number
  message: string
  totalPages?: number
  pageNumber?: number
  rowCount?: number
  rawErrorCode?: string
  rawMessage?: string
}
