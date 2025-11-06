import React, { useState, useMemo } from 'react'
import { toast } from 'sonner'
import useDialogState from '@/hooks/use-dialog-state'
import { mockComponents, mockCategorySummary } from '../data/mock-data'
import { type Component } from '../data/schema'

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
  categorySummary: typeof mockCategorySummary
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
    device?: string
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

  const filteredComponents = useMemo(() => {
    let filtered = [...mockComponents]

    if (params?.search) {
      const searchLower = params.search.toLowerCase()
      filtered = filtered.filter(
        (component) =>
          component.componentCode.toLowerCase().includes(searchLower) ||
          component.componentName.toLowerCase().includes(searchLower)
      )
    }

    if (params?.category) {
      const categoryIds = params.category.split(',').map(Number)
      filtered = filtered.filter((component) =>
        categoryIds.includes(component.categoryId)
      )
    }

    if (params?.status) {
      const statusIds = params.status.split(',').map(Number)
      filtered = filtered.filter((component) =>
        statusIds.includes(component.statusId)
      )
    }

    if (params?.device) {
      const deviceValues = params.device.split(',')
      filtered = filtered.filter((component) =>
        component.deviceType ? deviceValues.includes(component.deviceType) : false
      )
    }

    return filtered
  }, [params?.search, params?.category, params?.status, params?.device])

  const paginatedComponents = useMemo(() => {
    const pageIndex = params?.pageIndex ?? 1
    const pageSize = params?.pageSize ?? 10
    const start = (pageIndex - 1) * pageSize
    const end = start + pageSize
    return filteredComponents.slice(start, end)
  }, [filteredComponents, params?.pageIndex, params?.pageSize])

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
        components: paginatedComponents,
        totalCount: filteredComponents.length,
        pageIndex: params?.pageIndex ?? 1,
        pageSize: params?.pageSize ?? 10,
        isLoading: false,
        isError: false,
        categorySummary: mockCategorySummary,
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
