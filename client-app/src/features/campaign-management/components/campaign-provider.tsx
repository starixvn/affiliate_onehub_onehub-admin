import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import useDialogState from '@/hooks/use-dialog-state'
import { useGetCampaigns } from '../api/queries'
import { campaignApi } from '../api/client'
import { formatCampaignsForExcel } from './campaign-export-excel'
import { type Campaign } from '../data/schema'
import type { GetCampaignsRequest } from '../types'

type CampaignsDialogType = 'create' | 'update' | 'delete'

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
  exportCampaigns: () => Promise<void>
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
  const { t } = useTranslation('campaign-management')
  const [open, setOpen] = useDialogState<CampaignsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Campaign | null>(null)

  const { data, isLoading, isError } = useGetCampaigns(params)

  const exportCampaigns = async () => {
    try {
      const response = await campaignApi.exportCampaigns({
        ...params,
        isExportExcel: true,
      })

      await formatCampaignsForExcel(response.data.items, t, params)
      toast.success('Campaigns exported successfully')
    } catch (error) {
      toast.error('Failed to export campaigns')
      throw error
    }
  }

  return (
    <CampaignsContext
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        campaigns: data?.items ?? [],
        totalCount: data?.totalItem ?? 0,
        pageIndex: data?.pageIndex ?? 1,
        pageSize: data?.pageSize ?? 10,
        isLoading,
        isError,
        exportCampaigns,
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
