import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type Table as TanstackTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  OnChangeFn,
  PaginationState,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/data-table'
import type { AssetDetail } from '../../data/schema'
import { useAssetUploader } from '../asset-uploader-provider'
import { AssetBulkDeleteDialog } from '../dialog/asset-bulk-delete-dialog'
import { AssetBulkActions } from './asset-bulk-actions'
import { useAssetColumns } from './asset-columns'

interface AssetTableProps {
  data: AssetDetail[]
  onTableReady?: (table: TanstackTable<AssetDetail>) => void
  bannerRootUrl?: string
  totalCount?: number
}

export function AssetTable({
  data,
  onTableReady,
  bannerRootUrl,
  totalCount = 0,
}: AssetTableProps) {
  const { t } = useTranslation('asset-uploader')
  const { pageIndex, pageSize, navigate, search } = useAssetUploader()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const pagination = {
    pageIndex: pageIndex - 1,
    pageSize: pageSize,
  }

  const setPagination: OnChangeFn<PaginationState> = (updater) => {
    const nextState =
      typeof updater === 'function'
        ? updater({ pageIndex: pageIndex - 1, pageSize })
        : updater

    navigate({
      search: {
        ...search,
        pageIndex: nextState.pageIndex + 1,
        pageSize: nextState.pageSize,
      },
    })
  }

  useEffect(() => {
    setRowSelection({})
  }, [pageIndex, pageSize])

  const columns = useAssetColumns(bannerRootUrl, pagination)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
    if (onTableReady) {
      onTableReady(table)
    }
  }, [columnVisibility, table, onTableReady])

  return (
    <div className='space-y-4'>
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
                    <TableCell key={cell.id}>
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
      <AssetBulkActions
        table={table}
        onDeleteClick={() => setIsDeleteDialogOpen(true)}
      />
      <AssetBulkDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        table={table}
      />
    </div>
  )
}
