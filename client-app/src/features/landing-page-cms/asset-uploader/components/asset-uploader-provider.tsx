import React, { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import useDialogState from '@/hooks/use-dialog-state'
import { type NavigateFn } from '@/hooks/use-table-url-state'
import { useAssetFilters, useGetAssetList } from '../api/queries'
import { normalizeSearchParams } from '../data/constants'
import type { AssetDetail } from '../data/schema'
import {
  type AssetStatus,
  type Country,
  type Language,
  type Module,
} from '../types'

type AssetDialogType =
  | 'upload'
  | 'edit'
  | 'delete'
  | 'delete-bulk'
  | 'status-change'

const route = getRouteApi('/iframe/landing-page-cms/asset-uploader/')

type AssetUploaderContextType = {
  open: AssetDialogType | null
  setOpen: (str: AssetDialogType | null) => void
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
  assetStatus: Array<AssetStatus>
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
  const [open, setOpen] = useDialogState<AssetDialogType>(null)
  const [currentRow, setCurrentRow] = useState<AssetDetail | null>(null)
  const [targetStatusId, setTargetStatusId] = useState<number | null>(null)

  const navigate = route.useNavigate()
  const urlSearch = route.useSearch()
  const [localSearch, setLocalSearch] =
    useState<Record<string, unknown>>(urlSearch)

  const search = { ...urlSearch, ...localSearch }

  const updateSearchParams = (params: Record<string, unknown>) => {
    setLocalSearch((prev) => ({ ...prev, ...params }))
  }

  const {
    modules = [],
    countries = [],
    languages = [],
    assetStatus = [],
    landingPageUrl = '',
    bannerRootUrl = '',
    maximumFiles = 50,
    maxFileSize = 3,
    allowedExtensions = [],
  } = useAssetFilters() ?? {}

  const normalizedParams = normalizeSearchParams(search)
  const shouldUseAllModules =
    localSearch.moduleIdsAuto === true || !normalizedParams.moduleIds
  const params = {
    ...normalizedParams,
    moduleIds: shouldUseAllModules
      ? modules.map((_) => _.moduleId.toString()).join(',')
      : normalizedParams.moduleIds,
  }
  const { data, isLoading, isError } = useGetAssetList(params)

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
        assetStatus,
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
