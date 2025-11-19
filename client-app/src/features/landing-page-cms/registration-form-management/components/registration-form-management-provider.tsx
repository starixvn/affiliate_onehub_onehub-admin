import React, { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import useDialogState from '@/hooks/use-dialog-state'
import { type NavigateFn } from '@/hooks/use-table-url-state'
import { useRegisterFormFilters, useGetRegisterFormList } from '../api/queries'
import { normalizeSearchParams } from '../data/constants'
import type { RegisterFormDetail } from '../data/schema'
import {
  type RegisterFormStatus,
  type Country,
  type GetRegisterFormListRequest,
  type Language,
  type Module,
} from '../types'

type RegisterFormDialogType =
  | 'upload'
  | 'edit'
  | 'delete'
  | 'delete-bulk'
  | 'status-change'

const route = getRouteApi('/iframe/landing-page-cms/registration-form-management/')

type RegisterFormManagementContextType = {
  open: RegisterFormDialogType | null
  setOpen: (str: RegisterFormDialogType | null) => void
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
  registerFormStatus: Array<RegisterFormStatus>
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
  const [open, setOpen] = useDialogState<RegisterFormDialogType>(null)
  const [currentRow, setCurrentRow] = useState<RegisterFormDetail | null>(null)
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
    registerFormStatus = [],
    landingPageUrl = '',
    bannerRootUrl = '',
    maximumFiles = 50,
    maxFileSize = 3,
    allowedExtensions = [],
  } = useRegisterFormFilters() ?? {}

  const normalizedParams = normalizeSearchParams(search)
  const { data, isLoading, isError } = useGetRegisterFormList(
    normalizedParams as GetRegisterFormListRequest
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
        registerFormStatus,
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
