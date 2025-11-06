import React, { useState } from 'react'
import { toast } from 'sonner'
import useDialogState from '@/hooks/use-dialog-state'
import { useGetComponentSummary, useGetComponents } from '../api/queries'
import { type Component } from '../data/schema'
import type { ComponentCategorySummary } from '../types'

type ComponentsDialogType = 'create' | 'update' | 'delete'

type ComponentsContextType = {
  open: ComponentsDialogType | null
  setOpen: (str: ComponentsDialogType | null) => void
  currentRow: Component | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Component | null>>
  components: Component[]
  totalCount: number
  pageIndex: number
  pageSize: number
  isLoading: boolean
  isError: boolean
  categorySummary: ComponentCategorySummary | undefined
  selectedCategory: string
  exportComponents: () => Promise<void>
}

const ComponentsContext = React.createContext<ComponentsContextType | null>(
  null
)

type ComponentsProviderProps = {
  children: React.ReactNode
  params?: {
    search?: string
    category?: string
    status?: string
    deviceIds?: string
    pageIndex?: number
    pageSize?: number
  }
}

export function ComponentsProvider({
  children,
  params,
}: ComponentsProviderProps) {
  const [open, setOpen] = useDialogState<ComponentsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Component | null>(null)
  const { data: categorySummary } = useGetComponentSummary()

  const {
    data: componentsData,
    isLoading,
    isError,
  } = useGetComponents({
    search: params?.search,
    category: params?.category,
    status: params?.status,
    deviceIds: params?.deviceIds,
    pageIndex: params?.pageIndex ?? 1,
    pageSize: params?.pageSize ?? 10,
  })

  const exportComponents = async () => {
    try {
      toast.success('Components exported successfully')
    } catch (error) {
      toast.error('Failed to export components')
      throw error
    }
  }

  return (
    <ComponentsContext
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        components: componentsData?.items ?? [],
        totalCount: componentsData?.totalItem ?? 0,
        pageIndex: params?.pageIndex ?? 1,
        pageSize: params?.pageSize ?? 10,
        isLoading,
        isError,
        categorySummary,
        selectedCategory: params?.category ?? '1',
        exportComponents,
      }}
    >
      {children}
    </ComponentsContext>
  )
}

export const useComponents = () => {
  const componentsContext = React.useContext(ComponentsContext)

  if (!componentsContext) {
    throw new Error('useComponents has to be used within <ComponentsContext>')
  }

  return componentsContext
}
