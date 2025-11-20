import React, { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import useDialogState from '@/hooks/use-dialog-state'
import { type NavigateFn } from '@/hooks/use-table-url-state'
import {
  type MediaStatus,
  type Country,
  type Language,
  type Module,
  type DialogType,
  type GetMediaListRequest,
  createNormalizeSearchParams,
} from '@/features/landing-page-cms/shared'
import { useGetMediaList, useMediaFilters } from '../api/queries'
import type { AssetDetail } from '../data/schema'

const route = getRouteApi('/iframe/landing-page-cms/asset-uploader/')

type AssetUploaderContextType = {
  open: DialogType | null
  setOpen: (str: DialogType | null) => void
  currentRow: AssetDetail | null
  setCurrentRow: React.Dispatch<React.SetStateAction<AssetDetail | null>>
  targetStatusId: number | null
  setTargetStatusId: React.Dispatch<React.SetStateAction<number | null>>

  assets: AssetDetail[]
  totalCount: number
  pageIndex: number
  pageSize: number
  isLoading: boolean
  isError: boolean

  modules: Array<Module>
  countries: Array<Country>
  languages: Array<Language>
  mediaStatus: Array<MediaStatus>
  landingPageUrl: string
  bannerRootUrl: string
  maximumFiles: number
  maxFileSize: number
  allowedExtensions: Array<string>

  navigate: NavigateFn
  search: Record<string, unknown>
  updateSearchParams: (params: Record<string, unknown>) => void
}

const AssetUploaderContext =
  React.createContext<AssetUploaderContextType | null>(null)

type AssetUploaderProviderProps = {
  children: React.ReactNode
}

export function AssetUploaderProvider({
  children,
}: AssetUploaderProviderProps) {
  const [open, setOpen] = useDialogState<DialogType>(null)
  const [currentRow, setCurrentRow] = useState<AssetDetail | null>(null)
  const [targetStatusId, setTargetStatusId] = useState<number | null>(null)

  const navigate = route.useNavigate()
  const search = route.useSearch()

  const updateSearchParams = (params: Record<string, unknown>) => {
    navigate({
      search: {
        ...search,
        ...params,
      },
    })
  }

  const mediaFilters = useMediaFilters()
  const {
    modules = [],
    countries = [],
    languages = [],
    mediaStatus = [],
    landingPageUrl = '',
    bannerRootUrl = '',
    maximumFiles = 50,
    maxFileSize = 3,
    allowedExtensions = [],
  } = mediaFilters ?? {}

  const normalizedParams = createNormalizeSearchParams({})(search)
  const shouldUseAllModules =
    search.moduleIdsAuto === true || !normalizedParams.moduleIds
  const params = {
    ...normalizedParams,
    moduleIds: shouldUseAllModules
      ? modules.map((_) => _.moduleId.toString()).join(',')
      : normalizedParams.moduleIds,
  }
  const { data, isLoading, isError } = useGetMediaList(
    mediaFilters?.isLoading === false
      ? (params as GetMediaListRequest)
      : undefined
  )

  return (
    <AssetUploaderContext
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        targetStatusId,
        setTargetStatusId,

        assets: data?.items ?? [],
        totalCount: data?.totalItem ?? 0,
        pageIndex: data?.pageIndex ?? 1,
        pageSize: data?.pageSize ?? 10,
        isLoading,
        isError,

        modules,
        countries,
        languages,
        mediaStatus,
        landingPageUrl,
        bannerRootUrl,
        maximumFiles,
        maxFileSize,
        allowedExtensions,

        navigate,
        search,
        updateSearchParams,
      }}
    >
      {children}
    </AssetUploaderContext>
  )
}

export const useAssetUploader = () => {
  const context = React.useContext(AssetUploaderContext)

  if (!context) {
    throw new Error(
      'useAssetUploader has to be used within <AssetUploaderProvider>'
    )
  }

  return context
}
