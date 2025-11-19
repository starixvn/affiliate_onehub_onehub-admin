import React, { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import useDialogState from '@/hooks/use-dialog-state'
import { type NavigateFn } from '@/hooks/use-table-url-state'
import { useAssetFilters, useGetAssetList } from '../api/queries'
import type { AssetDetail } from '../data/schema'
import {
  AssetStatus,
  Country,
  GetAssetListRequest,
  Language,
  Module,
} from '../types'

type AssetDialogType = 'upload' | 'edit' | 'delete' | 'delete-bulk'

const route = getRouteApi('/iframe/landing-page-cms/asset-uploader/')

type AssetUploaderContextType = {
  open: AssetDialogType | null
  setOpen: (str: AssetDialogType | null) => void
  currentRow: AssetDetail | null
  setCurrentRow: React.Dispatch<React.SetStateAction<AssetDetail | null>>

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
}

const AssetUploaderContext =
  React.createContext<AssetUploaderContextType | null>(null)

type AssetUploaderProviderProps = {
  children: React.ReactNode
  params?: {
    mediaName?: string
    moduleIds?: string
    targetCountrycodes?: string
    languageCodes?: string
    status?: number
    pageIndex?: number
    pageSize?: number
  }
}

export function AssetUploaderProvider({
  children,
  params,
}: AssetUploaderProviderProps) {
  const [open, setOpen] = useDialogState<AssetDialogType>(null)
  const [currentRow, setCurrentRow] = useState<AssetDetail | null>(null)

  const navigate = route.useNavigate()
  const search = route.useSearch()

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

  const { data, isLoading, isError } = useGetAssetList(
    params as GetAssetListRequest
  )

  return (
    <AssetUploaderContext
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,

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
