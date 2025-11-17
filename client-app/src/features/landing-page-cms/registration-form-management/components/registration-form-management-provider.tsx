import React, { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import useDialogState from '@/hooks/use-dialog-state'
import { type NavigateFn } from '@/hooks/use-table-url-state'
import type {
  MediaStatus,
  Country,
  Language,
  Module,
  GetMediaListRequest,
  DialogType,
} from '@/features/landing-page-cms/shared'
import { createNormalizeSearchParams } from '@/features/landing-page-cms/shared'
import { useMediaFilters, useGetMediaList } from '../api/queries'
import {
  type RegisterFormDetail,
  REGISTER_FORM_MODULE_ID,
} from '../data/schema'

const route = getRouteApi(
  '/iframe/landing-page-cms/registration-form-management/'
)

type RegisterFormManagementContextType = {
  open: DialogType | null
  setOpen: (str: DialogType | null) => void
  currentRow: RegisterFormDetail | null
  setCurrentRow: React.Dispatch<React.SetStateAction<RegisterFormDetail | null>>
  targetStatusId: number | null
  setTargetStatusId: React.Dispatch<React.SetStateAction<number | null>>

  registerForms: RegisterFormDetail[]
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

const RegisterFormManagementContext =
  React.createContext<RegisterFormManagementContextType | null>(null)

type RegisterFormManagementProviderProps = {
  children: React.ReactNode
}

export function RegisterFormManagementProvider({
  children,
}: RegisterFormManagementProviderProps) {
  const [open, setOpen] = useDialogState<DialogType>(null)
  const [currentRow, setCurrentRow] = useState<RegisterFormDetail | null>(null)
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
  } = useMediaFilters() ?? {}

  const normalizedParams = createNormalizeSearchParams({})(search)
  const params = {
    ...normalizedParams,
    moduleIds: REGISTER_FORM_MODULE_ID.toString(),
  }

  const { data, isLoading, isError } = useGetMediaList(
    params as GetMediaListRequest
  )

  return (
    <RegisterFormManagementContext
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        targetStatusId,
        setTargetStatusId,

        registerForms: data?.items ?? [],
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
    </RegisterFormManagementContext>
  )
}

export const useRegisterFormManagement = () => {
  const context = React.useContext(RegisterFormManagementContext)

  if (!context) {
    throw new Error(
      'useRegisterFormManagement has to be used within <RegisterFormManagementProvider>'
    )
  }

  return context
}
