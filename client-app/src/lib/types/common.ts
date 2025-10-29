export interface IAxiosResponse<T = unknown> {
  errorCode: number
  errorMessage: string
  result: T
}

export interface IPaginatedResponse<T> {
  items: T[]
  totalCount: number
  pageIndex: number
  pageSize: number
}
