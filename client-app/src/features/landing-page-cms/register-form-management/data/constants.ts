import type { GetRegisterFormListRequest } from '../types'

export const REGISTER_FORM_MODULE_ID = 9

export const DEFAULT_REGISTER_FORM_PARAMS: GetRegisterFormListRequest = {
  mediaId: 0,
  mediaName: undefined,
  moduleIds: REGISTER_FORM_MODULE_ID.toString(),
  targetCountrycodes: 'all',
  languageCodes: 'all',
  status: 1,
  currentStatus: [1],
  pageIndex: 1,
  pageSize: 10,
} as const

export const normalizeSearchParams = (
  search: Record<string, unknown>
): GetRegisterFormListRequest => {
  return {
    mediaId: search.mediaId
      ? Number(search.mediaId)
      : DEFAULT_REGISTER_FORM_PARAMS.mediaId,
    mediaName:
      (search.mediaName as string) ?? DEFAULT_REGISTER_FORM_PARAMS.mediaName,
    moduleIds:
      (search.moduleIds as string) ?? DEFAULT_REGISTER_FORM_PARAMS.moduleIds,
    targetCountrycodes:
      (search.targetCountrycodes as string) ??
      DEFAULT_REGISTER_FORM_PARAMS.targetCountrycodes,
    languageCodes:
      (search.languageCodes as string) ??
      DEFAULT_REGISTER_FORM_PARAMS.languageCodes,
    status:
      search.status !== undefined
        ? Number(search.status)
        : DEFAULT_REGISTER_FORM_PARAMS.status,
    currentStatus:
      search.currentStatus !== undefined
        ? (search.currentStatus as number[])
        : [DEFAULT_REGISTER_FORM_PARAMS.status],
    pageIndex: search.pageIndex
      ? Number(search.pageIndex)
      : DEFAULT_REGISTER_FORM_PARAMS.pageIndex,
    pageSize: search.pageSize
      ? Number(search.pageSize)
      : DEFAULT_REGISTER_FORM_PARAMS.pageSize,
  }
}
