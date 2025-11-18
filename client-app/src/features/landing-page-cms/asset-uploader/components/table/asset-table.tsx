import { useState, useEffect, useMemo, useRef } from 'react'
import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type OnChangeFn,
  type PaginationState,
} from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import {
  MediaBulkStatusChangeDialog,
  MediaBulkDeleteDialog,
  MediaBulkActions,
} from '@/features/landing-page-cms/shared'
import { useDeleteMedias, useUpdateMediaStatus } from '../../api/commands'
import { TRANSLATION_KEY, type AssetDetail } from '../../data/schema'
import { useAssetUploader } from '../asset-uploader-provider'
import { useAssetColumns } from './asset-columns'

interface AssetTableProps {
  data: AssetDetail[]
  bannerRootUrl?: string
  totalCount?: number
}

const DEFAULT_STATUS_FILTER = ['1']
const DEFAULT_EMPTY_FILTER: string[] = []
const DEFAULT_PAGE_SIZE = 10

export function AssetTable({
  data,
  bannerRootUrl,
  totalCount = 0,
}: AssetTableProps) {
  const { t } = useTranslation(TRANSLATION_KEY)
  const {
    pageIndex,
    pageSize,
    search,
    mediaStatus,
    modules,
    countries,
    languages,
    updateSearchParams,
    setOpen,
    setCurrentRow,
    targetStatusId,
    setTargetStatusId,
  } = useAssetUploader()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isStatusChangeDialogOpen, setIsStatusChangeDialogOpen] =
    useState(false)

  const pagination = {
    pageIndex: pageIndex - 1,
    pageSize: pageSize,
  }

  const setPagination: OnChangeFn<PaginationState> = (updater) => {
    const nextState =
      typeof updater === 'function'
        ? updater({ pageIndex: pageIndex - 1, pageSize })
        : updater

    updateSearchParams({
      pageIndex: nextState.pageIndex + 1,
      pageSize: nextState.pageSize,
    })
  }

  useEffect(() => {
    setRowSelection({})
  }, [pageIndex, pageSize])

  const handleEdit = (asset: AssetDetail) => {
    setCurrentRow(asset)
    setOpen('edit')
  }

  const handleDelete = (asset: AssetDetail) => {
    setCurrentRow(asset)
    setOpen('delete')
  }

  const handleStatusChange = (statusId: number, asset: AssetDetail) => {
    setCurrentRow(asset)
    setTargetStatusId(statusId)
    setOpen('status-change')
  }

  const columns = useAssetColumns(
    bannerRootUrl,
    pagination,
    handleEdit,
    handleDelete,
    handleStatusChange
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualFiltering: true,
    manualPagination: true,
    pageCount: Math.ceil(totalCount / (pageSize ?? DEFAULT_PAGE_SIZE)),
    enableRowSelection: true,
    rowCount: totalCount,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  })

  const tableRef = useRef(table)
  tableRef.current = table

  useEffect(() => {
    const statusColumn = tableRef.current.getColumn('statusId')
    if (!statusColumn) return

    const currentFilterValue = statusColumn.getFilterValue() as
      | string[]
      | undefined
    let newFilterValue: string[] = []

    if (search.currentStatus) {
      newFilterValue = Array.isArray(search.currentStatus)
        ? search.currentStatus.map(String)
        : []
    } else {
      newFilterValue = ['1']
    }

    const currentStr = currentFilterValue?.sort().join(',') || ''
    const newStr = newFilterValue.sort().join(',')
    if (currentStr !== newStr) {
      statusColumn.setFilterValue(newFilterValue)
    }
  }, [search.currentStatus])

  const moduleOptions = modules.map((module) => ({
    value: module.moduleId.toString(),
    label: module.moduleName,
  }))
  const defaultModuleIds = useMemo(
    () => modules.map((module) => module.moduleId.toString()),
    [modules]
  )

  useEffect(() => {
    const moduleColumn = tableRef.current.getColumn('moduleId')
    if (!moduleColumn) return

    const currentFilterValue = moduleColumn.getFilterValue() as
      | string[]
      | undefined
    let newFilterValue: string[] = []

    if (search.moduleIds) {
      const moduleValues =
        typeof search.moduleIds === 'string' ? search.moduleIds.split(',') : []
      const isAutoSet = search.moduleIdsAuto === true
      if (isAutoSet) {
        newFilterValue = []
      } else {
        newFilterValue = moduleValues
      }
    } else {
      newFilterValue = []
    }

    const currentStr = currentFilterValue?.sort().join(',') || ''
    const newStr = newFilterValue.sort().join(',')
    if (currentStr !== newStr) {
      moduleColumn.setFilterValue(newFilterValue)
    }
  }, [search.moduleIds, search.moduleIdsAuto, defaultModuleIds])

  useEffect(() => {
    const countryColumn = tableRef.current.getColumn('targetCountryCode')
    if (!countryColumn) return

    const currentFilterValue = countryColumn.getFilterValue() as
      | string[]
      | undefined
    let newFilterValue: string[] = []

    if (search.targetCountrycodes && search.targetCountrycodes !== 'all') {
      newFilterValue =
        typeof search.targetCountrycodes === 'string'
          ? search.targetCountrycodes.split(',')
          : []
    }
    const currentStr = currentFilterValue?.sort().join(',') || ''
    const newStr = newFilterValue.sort().join(',')
    if (currentStr !== newStr) {
      countryColumn.setFilterValue(newFilterValue)
    }
  }, [search.targetCountrycodes])

  useEffect(() => {
    const languageColumn = tableRef.current.getColumn('languageCode')
    if (!languageColumn) return

    const currentFilterValue = languageColumn.getFilterValue() as
      | string[]
      | undefined
    let newFilterValue: string[] = []

    if (search.languageCodes && search.languageCodes !== 'all') {
      newFilterValue =
        typeof search.languageCodes === 'string'
          ? search.languageCodes.split(',')
          : []
    }

    const currentStr = currentFilterValue?.sort().join(',') || ''
    const newStr = newFilterValue.sort().join(',')
    if (currentStr !== newStr) {
      languageColumn.setFilterValue(newFilterValue)
    }
  }, [search.languageCodes])
  const countryOptions = countries.map((country) => ({
    value: country.targetCountryCode,
    label: country.targetCountryName,
  }))
  const languageOptions = [
    ...new Map(
      languages.map((language) => [language.languageCode, language])
    ).values(),
  ].map((language) => ({
    value: language.languageCode,
    label: language.languageName,
  }))

  const filters = useMemo(
    () => [
      {
        columnId: 'moduleId',
        title: t('filters.module'),
        options: moduleOptions,
        defaultValue: [],
      },
      {
        columnId: 'targetCountryCode',
        title: t('filters.country'),
        options: countryOptions,
        defaultValue: [],
      },
      {
        columnId: 'languageCode',
        title: t('filters.language'),
        options: languageOptions,
        defaultValue: [],
      },
      {
        columnId: 'statusId',
        title: t('filters.status'),
        options: mediaStatus.map(({ statusId, status }) => ({
          label: status,
          value: statusId.toString(),
        })),
        defaultValue: DEFAULT_STATUS_FILTER,
      },
    ],
    [moduleOptions, countryOptions, languageOptions, mediaStatus, t]
  )

  const handleSubmitFilters = (searchValueToUse: string) => {
    const statusFilter = table.getColumn('statusId')?.getFilterValue() as
      | string[]
      | undefined
    const moduleFilter = table.getColumn('moduleId')?.getFilterValue() as
      | string[]
      | undefined
    const countryFilter = table
      .getColumn('targetCountryCode')
      ?.getFilterValue() as string[] | undefined
    const languageFilter = table.getColumn('languageCode')?.getFilterValue() as
      | string[]
      | undefined

    updateSearchParams({
      mediaName: searchValueToUse || undefined,
      moduleIds: moduleFilter?.length
        ? moduleFilter.join(',')
        : defaultModuleIds.join(','),
      moduleIdsAuto: moduleFilter?.length ? false : true,
      targetCountrycodes: countryFilter?.length
        ? countryFilter.join(',')
        : 'all',
      languageCodes: languageFilter?.length ? languageFilter.join(',') : 'all',
      currentStatus: statusFilter?.map(Number) || [],
      status: statusFilter?.length === 1 ? Number(statusFilter[0]) : -1,
      pageIndex: 1,
    })
  }

  return (
    <div className='space-y-4'>
      <DataTableToolbar
        table={table}
        searchPlaceholder={t('filters.searchPlaceholder')}
        searchClassName='w-[250px] lg:w-[350px]'
        filters={filters}
        submitLabel={t('filters.search')}
        initialSearchValue={(search.mediaName as string) ?? ''}
        defaultSearchValue=''
        onSubmit={(submittedSearchValue) => {
          handleSubmitFilters(submittedSearchValue)
        }}
        onReset={() => {
          table.getColumn('statusId')?.setFilterValue(DEFAULT_STATUS_FILTER)
          table.getColumn('moduleId')?.setFilterValue(DEFAULT_EMPTY_FILTER)
          table
            .getColumn('targetCountryCode')
            ?.setFilterValue(DEFAULT_EMPTY_FILTER)
          table.getColumn('languageCode')?.setFilterValue(DEFAULT_EMPTY_FILTER)
        }}
      />

      <div className='bg-card rounded-lg border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={header.column.columnDef.meta?.className}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className='text-muted-foreground h-24 text-center'
                >
                  {t('page.noResults')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
      <MediaBulkActions
        table={table}
        onDeleteClick={() => setIsDeleteDialogOpen(true)}
        onStatusChangeClick={(statusId) => {
          setTargetStatusId(statusId)
          setIsStatusChangeDialogOpen(true)
        }}
        entityName='asset'
        translationKey={TRANSLATION_KEY}
      />
      <MediaBulkDeleteDialog
        translationKey={TRANSLATION_KEY}
        useDeleteMutation={useDeleteMedias}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        table={table}
      />
      {targetStatusId && (
        <MediaBulkStatusChangeDialog
          translationKey={TRANSLATION_KEY}
          useUpdateStatusMutation={useUpdateMediaStatus}
          open={isStatusChangeDialogOpen}
          onOpenChange={(open) => {
            setIsStatusChangeDialogOpen(open)
            if (!open) setTargetStatusId(null)
          }}
          table={table}
          newStatusId={targetStatusId}
        />
      )}
    </div>
  )
}
