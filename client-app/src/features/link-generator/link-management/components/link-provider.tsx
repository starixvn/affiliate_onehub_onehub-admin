import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import useDialogState from '@/hooks/use-dialog-state'
import { useGetLinks } from '../api/queries'
import { linkApi } from '../api/client'
import { formatLinksForExcel } from './link-export-excel'
import { type LinkInfo } from '../data/schema'
import type { GetLinksRequest } from '../types'

type LinksDialogType = 'detail' | 'status'

type LinksContextType = {
  open: LinksDialogType | null
  setOpen: (str: LinksDialogType | null) => void
  currentRow: LinkInfo | null
  setCurrentRow: React.Dispatch<React.SetStateAction<LinkInfo | null>>
  links: LinkInfo[]
  totalCount: number
  pageIndex: number
  pageSize: number
  isLoading: boolean
  isError: boolean
  exportLinks: () => Promise<void>
}

const LinksContext = React.createContext<LinksContextType | null>(null)

type LinksProviderProps = {
  children: React.ReactNode
  params?: GetLinksRequest
}

export function LinksProvider({
  children,
  params
}: LinksProviderProps) {
  const { t } = useTranslation('link-management')
  const [open, setOpen] = useDialogState<LinksDialogType>(null)
  const [currentRow, setCurrentRow] = useState<LinkInfo | null>(null)

  const { data, isLoading, isError } = useGetLinks(params)

  const exportLinks = async () => {
    try {
      const response = await linkApi.exportLinks({
        ...params,
        isExportExcel: true,
      })

      await formatLinksForExcel(response.data.items, t, params)
      toast.success('Links exported successfully')
    } catch (error) {
      toast.error('Failed to export links')
      throw error
    }
  }

  return (
    <LinksContext
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        links: data?.items ?? [],
        totalCount: data?.totalItem ?? 0,
        pageIndex: data?.pageIndex ?? 1,
        pageSize: data?.pageSize ?? 10,
        isLoading,
        isError,
        exportLinks,
      }}
    >
      {children}
    </LinksContext>
  )
}

export const useLinks = () => {
  const linksContext = React.useContext(LinksContext)

  if (!linksContext) {
    throw new Error('useLinks has to be used within <LinksProvider>')
  }

  return linksContext
}

