export interface IPaginatedResponse<T> {
  items: T[]
  totalItem: number
  pageIndex: number
  pageSize: number
}
