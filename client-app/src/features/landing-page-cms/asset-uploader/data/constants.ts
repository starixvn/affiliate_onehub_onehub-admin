import type { GetAssetListRequest } from '../types'

export const EXCLUDE_MODULE_TYPES = [3, 4] as const;

export const DEFAULT_PARAMS = {
  mediaId: 0,
  mediaName: undefined,
  moduleIds: undefined,
  targetCountrycodes: 'all',
  languageCodes: 'all',
  status: -1,
  pageIndex: 1,
  pageSize: 10,
} as const

export const COLUMN_DISPLAY_NAMES: Record<string, string> = {
  mediaName: 'File Name',
  moduleName: 'Module',
  targetCountryName: 'Country',
  marketName: 'Language',
  dimension: 'Dimensions',
  statusId: 'Status',
  preview: 'Preview Asset',
}

export function normalizeSearchParams(
  search: Record<string, unknown>
): GetAssetListRequest {
  return {
    mediaId: search.mediaId ? Number(search.mediaId) : DEFAULT_PARAMS.mediaId,
    mediaName: (search.mediaName as string) ?? DEFAULT_PARAMS.mediaName,
    moduleIds: (search.moduleIds as string) ?? DEFAULT_PARAMS.moduleIds,
    targetCountrycodes:
      (search.targetCountrycodes as string) ??
      DEFAULT_PARAMS.targetCountrycodes,
    languageCodes:
      (search.languageCodes as string) ?? DEFAULT_PARAMS.languageCodes,
    status:
      search.status !== undefined
        ? Number(search.status)
        : DEFAULT_PARAMS.status,
    pageIndex: search.pageIndex
      ? Number(search.pageIndex)
      : DEFAULT_PARAMS.pageIndex,
    pageSize: search.pageSize
      ? Number(search.pageSize)
      : DEFAULT_PARAMS.pageSize,
  }
}
