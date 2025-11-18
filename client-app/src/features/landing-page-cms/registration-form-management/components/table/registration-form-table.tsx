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
  MediaBulkDeleteDialog,
  MediaBulkStatusChangeDialog,
  MediaBulkActions,
} from '@/features/landing-page-cms/shared'
import { useDeleteMedias, useUpdateMediaStatus } from '../../api/commands'
import { TRANSLATION_KEY, type RegisterFormDetail } from '../../data/schema'
import { useRegisterFormManagement } from '../registration-form-management-provider'
import { useRegisterFormColumns } from './registration-form-columns'

const DEFAULT_STATUS_FILTER = ['1']
const DEFAULT_EMPTY_FILTER: string[] = []
const DEFAULT_PAGE_SIZE = 10

export function RegisterFormTable() {
  const { t } = useTranslation(TRANSLATION_KEY)
  const {
    registerForms,
    totalCount,
    pageIndex,
    pageSize,
    search,
    countries,
    languages,
    mediaStatus,
    bannerRootUrl,
    updateSearchParams,
    setOpen,
    setCurrentRow,
    targetStatusId,
    setTargetStatusId,
  } = useRegisterFormManagement()
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

  const handleEdit = (form: RegisterFormDetail) => {
    setCurrentRow(form)
    setOpen('edit')
  }

  const handleDelete = (form: RegisterFormDetail) => {
    setCurrentRow(form)
    setOpen('delete')
  }

  const handleStatusChange = (statusId: number, form: RegisterFormDetail) => {
    setCurrentRow(form)
    setTargetStatusId(statusId)
    setOpen('status-change')
  }

  const columns = useRegisterFormColumns(
    bannerRootUrl,
    pagination,
    handleEdit,
    handleDelete,
    handleStatusChange
  )

  const table = useReactTable({
    data: registerForms,
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
    setRowSelection({})
  }, [pageIndex, pageSize])

  useEffect(() => {
    const statusColumn = tableRef.current.getColumn('statusId')
    if (!statusColumn) return

    const currentFilterValue = statusColumn.getFilterValue() as
      | string[]
      | undefined
    let newFilterValue: string[] = []

    if (search.currentStatus) {
      newFilterValue = (search.currentStatus as number[]).map(String)
    } else {
      newFilterValue = ['1']
    }

    const currentStr = currentFilterValue ? [...currentFilterValue].sort().join(',') : ''
    const newStr = newFilterValue.sort().join(',')
    if (currentStr !== newStr) {
      statusColumn.setFilterValue(newFilterValue)
    }
  }, [search.currentStatus])

  useEffect(() => {
    const countryColumn = tableRef.current.getColumn('targetCountryCode')
    if (!countryColumn) return

    const currentFilterValue = countryColumn.getFilterValue() as
      | string[]
      | undefined
    let newFilterValue: string[] = []

    if (search.targetCountrycodes && search.targetCountrycodes !== 'all') {
      newFilterValue = (search.targetCountrycodes as string).split(',')
    } else {
      newFilterValue = []
    }

    const currentStr = currentFilterValue ? [...currentFilterValue].sort().join(',') : ''
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
      newFilterValue = (search.languageCodes as string).split(',')
    } else {
      newFilterValue = []
    }

    const currentStr = currentFilterValue ? [...currentFilterValue].sort().join(',') : ''
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
        columnId: 'targetCountryCode',
        title: t('filters.country'),
        options: countryOptions,
        defaultValue: DEFAULT_EMPTY_FILTER,
      },
      {
        columnId: 'languageCode',
        title: t('filters.language'),
        options: languageOptions,
        defaultValue: DEFAULT_EMPTY_FILTER,
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
    [countryOptions, languageOptions, mediaStatus, t]
  )

  const handleSubmitFilters = (searchValueToUse: string) => {
    const statusFilter = table.getColumn('statusId')?.getFilterValue() as
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
        entityName='form'
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
