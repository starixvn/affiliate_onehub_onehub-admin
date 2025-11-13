import { useState, useEffect, useMemo } from 'react'
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
  type Table as TanstackTable,
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
import { useDeleteMedia, useUpdateMediaStatus } from '../../api/commands'
import { TRANSLATION_KEY, type RegisterFormDetail } from '../../data/schema'
import { useRegisterFormManagement } from '../registration-form-management-provider'
import { useRegisterFormColumns } from './registration-form-columns'

interface RegisterFormTableProps {
  onTableReady?: (table: TanstackTable<RegisterFormDetail>) => void
}

export function RegisterFormTable({
  onTableReady,
}: RegisterFormTableProps = {}) {
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
  } = useRegisterFormManagement()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isStatusChangeDialogOpen, setIsStatusChangeDialogOpen] =
    useState(false)
  const [targetStatusId, setTargetStatusId] = useState<number | null>(null)
  const [searchValue, setSearchValue] = useState(
    (search.mediaName as string) || ''
  )

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
    pageCount: Math.ceil(totalCount / (pageSize ?? 10)),
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

  useEffect(() => {
    setRowSelection({})
  }, [pageIndex, pageSize, registerForms])

  useEffect(() => {
    if (onTableReady) {
      onTableReady(table)
    }
  }, [columnVisibility, table, onTableReady])

  useEffect(() => {
    const statusColumn = table.getColumn('statusId')
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

    const currentStr = currentFilterValue?.sort().join(',') || ''
    const newStr = newFilterValue.sort().join(',')
    if (currentStr !== newStr) {
      statusColumn.setFilterValue(newFilterValue)
    }
  }, [search.currentStatus, table])

  useEffect(() => {
    const countryColumn = table.getColumn('targetCountryCode')
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

    const currentStr = currentFilterValue?.sort().join(',') || ''
    const newStr = newFilterValue.sort().join(',')
    if (currentStr !== newStr) {
      countryColumn.setFilterValue(newFilterValue)
    }
  }, [search.targetCountrycodes, table])

  useEffect(() => {
    const languageColumn = table.getColumn('languageCode')
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

    const currentStr = currentFilterValue?.sort().join(',') || ''
    const newStr = newFilterValue.sort().join(',')
    if (currentStr !== newStr) {
      languageColumn.setFilterValue(newFilterValue)
    }
  }, [search.languageCodes, table])

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
        defaultValue: ['1'],
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
        initialSearchValue={searchValue}
        defaultSearchValue=''
        onSubmit={(submittedSearchValue) => {
          setSearchValue(submittedSearchValue)
          handleSubmitFilters(submittedSearchValue)
        }}
        onReset={() => {
          setSearchValue('')
          table.getColumn('statusId')?.setFilterValue(['1'])
          table.getColumn('targetCountryCode')?.setFilterValue([])
          table.getColumn('languageCode')?.setFilterValue([])
        }}
      />

      <div className='bg-card rounded-lg border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
        useDeleteMutation={useDeleteMedia}
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
