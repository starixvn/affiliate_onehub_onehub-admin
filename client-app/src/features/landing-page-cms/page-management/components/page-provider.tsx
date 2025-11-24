import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { getRouteApi } from '@tanstack/react-router'
import useDialogState from '@/hooks/use-dialog-state'
import { useGetLandingPages, usePageFilters } from '../api/queries'
import { landingPageApi } from '../api/client'
import { formatLandingPagesForExcel } from './page-export-excel'
import { type LandingPage } from '../data/schema'
import type { GetLandingPagesRequest, Country, Language, PageStatus } from '../types'

const route = getRouteApi('/iframe/landing-page-cms/page-management/')

type LandingPagesDialogType = 'create' | 'update' | 'delete' | 'duplicate'

type LandingPagesContextType = {
  open: LandingPagesDialogType | null
  setOpen: (str: LandingPagesDialogType | null) => void
  currentRow: LandingPage | null
  setCurrentRow: React.Dispatch<React.SetStateAction<LandingPage | null>>
  landingPages: LandingPage[]
  totalCount: number
  pageIndex: number
  pageSize: number
  isLoading: boolean
  isError: boolean
  exportLandingPages: () => Promise<void>
  countries: Country[]
  languages: Language[]
  pageStatus: PageStatus[]
  landingPageUrl: string
  minDate: Date
  maxDate: Date
  defaultFromDate: Date
  defaultToDate: Date
  navigate: ReturnType<typeof route.useNavigate>
  search: ReturnType<typeof route.useSearch>
}

const LandingPagesContext = React.createContext<LandingPagesContextType | null>(
  null
)

type LandingPagesProviderProps = {
  children: React.ReactNode
  params?: GetLandingPagesRequest
}

export function LandingPagesProvider({
  children,
  params,
}: LandingPagesProviderProps) {
  const { t } = useTranslation('page-management')
  const [open, setOpen] = useDialogState<LandingPagesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<LandingPage | null>(null)

  const navigate = route.useNavigate()
  const search = route.useSearch()

  const {
    countries = [],
    languages = [],
    pageStatus = [],
    landingPageUrl = '',
    minDate = new Date(new Date().getFullYear() - 2, new Date().getMonth(), new Date().getDate()),
    maxDate = new Date(),
    defaultFromDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    defaultToDate = new Date(),
  } = usePageFilters() ?? {}

  const { data, isLoading, isError } = useGetLandingPages(params)

  const exportLandingPages = async () => {
    try {
      const response = await landingPageApi.exportLandingPages(params)

      await formatLandingPagesForExcel(response.data.items, t, params)
      toast.success('Landing pages exported successfully')
    } catch (error) {
      toast.error('Failed to export landing pages')
      throw error
    }
  }


  const memoizedMinDate = React.useMemo(() => {
    const date = minDate ?? new Date(new Date().getFullYear() - 2, new Date().getMonth(), new Date().getDate())
    date.setHours(0, 0, 0, 0)
    return date
  }, [minDate])

  const memoizedMaxDate = React.useMemo(() => {
    const date = maxDate ?? new Date()
    date.setHours(0, 0, 0, 0)
    return date
  }, [maxDate])

  const memoizedDefaultFromDate = React.useMemo(() => {
    const date = defaultFromDate ?? new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    date.setHours(0, 0, 0, 0)
    return date
  }, [defaultFromDate])

  const memoizedDefaultToDate = React.useMemo(() => {
    const date = defaultToDate ?? new Date()
    date.setHours(0, 0, 0, 0)
    return date
  }, [defaultToDate])

  const contextValue = React.useMemo(() => ({
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    landingPages: data?.items ?? [],
    totalCount: data?.totalItem ?? 0,
    pageIndex: data?.pageIndex ?? 1,
    pageSize: data?.pageSize ?? 10,
    isLoading,
    isError,
    exportLandingPages,
    countries,
    languages,
    pageStatus,
    landingPageUrl,
    minDate: memoizedMinDate as Date,
    maxDate: memoizedMaxDate as Date,
    defaultFromDate: memoizedDefaultFromDate as Date,
    defaultToDate: memoizedDefaultToDate as Date,
    navigate,
    search,
  }), [
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    data,
    isLoading,
    isError,
    countries,
    languages,
    pageStatus,
    landingPageUrl,
    memoizedMinDate,
    memoizedMaxDate,
    memoizedDefaultFromDate,
    memoizedDefaultToDate,
    navigate,
    search
  ])

  return (
    <LandingPagesContext
      value={contextValue}
    >
      {children}
    </LandingPagesContext>
  )
}

export const useLandingPages = () => {
  const landingPagesContext = React.useContext(LandingPagesContext)

  if (!landingPagesContext) {
    throw new Error('useLandingPages has to be used within <LandingPagesContext>')
  }

  return landingPagesContext
}

