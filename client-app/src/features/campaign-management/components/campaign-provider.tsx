import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { useGetCampaigns } from '../api/queries'
import { type Campaign } from '../data/schema'
import type { GetCampaignsRequest } from '../types'

type CampaignsDialogType = 'create' | 'update' | 'delete' | 'import'

type CampaignsContextType = {
  open: CampaignsDialogType | null
  setOpen: (str: CampaignsDialogType | null) => void
  currentRow: Campaign | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Campaign | null>>
  campaigns: Campaign[]
  totalCount: number
  pageIndex: number
  pageSize: number
  isLoading: boolean
  isError: boolean
}

const CampaignsContext = React.createContext<CampaignsContextType | null>(null)

type CampaignsProviderProps = {
  children: React.ReactNode
  params?: GetCampaignsRequest
}

export function CampaignsProvider({
  children,
  params,
}: CampaignsProviderProps) {
  const [open, setOpen] = useDialogState<CampaignsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Campaign | null>(null)

  const { data, isLoading, isError } = useGetCampaigns(params)

  return (
    <CampaignsContext
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        campaigns: data?.items ?? [],
        totalCount: data?.totalCount ?? 0,
        pageIndex: data?.pageIndex ?? 1,
        pageSize: data?.pageSize ?? 10,
        isLoading,
        isError,
      }}
    >
      {children}
    </CampaignsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCampaigns = () => {
  const campaignsContext = React.useContext(CampaignsContext)

  if (!campaignsContext) {
    throw new Error('useCampaigns has to be used within <TasksContext>')
  }

  return campaignsContext
}
