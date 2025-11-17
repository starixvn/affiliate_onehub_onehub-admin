import { useState, useMemo } from 'react'
import {
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { type NavigateFn } from '@/hooks/use-table-url-state'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { type LinkInfo } from '../../data/schema'
import { getLinkColumns } from './link-columns'

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData, TValue> {
        className: string
        displayName?: string
    }
}

type DataTableProps = {
    data: LinkInfo[]
    totalCount: number
    pageIndex: number
    pageSize: number
    search: Record<string, unknown>
    navigate: NavigateFn
}

export function LinkTable({
    data,
    totalCount,
    pageIndex,
    pageSize,
    search,
    navigate,
}: DataTableProps) {
    const { t } = useTranslation('link-management')
    const [rowSelection, setRowSelection] = useState({})
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [sorting, setSorting] = useState<SortingState>([])

    const columns = useMemo(() => getLinkColumns(t), [t])

    const pageCount = Math.ceil(totalCount / pageSize)

    const table = useReactTable({
        data,
        columns,
        pageCount,
        rowCount: totalCount,
        state: {
            sorting,
            pagination: {
                pageIndex: pageIndex - 1,
                pageSize,
            },
            rowSelection,
            columnVisibility,
        },
        getRowId: (row) => String(row.linkId),
        manualPagination: true,
        enableRowSelection: true,
        onPaginationChange: (updater) => {
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
        },
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    return (
        <div
            className={cn(
                'max-sm:has-[div[role="toolbar"]]:mb-16',
                'flex flex-1 flex-col gap-4'
            )}
        >
            <DataTableToolbar
                table={table}
                searchPlaceholder={t('table.search')}
                searchClassName='w-[250px] lg:w-[350px]'
                filters={[]}
                submitLabel={t('searchToolbar.submit')}
                initialSearchValue={(search.search as string) ?? ''}
                onSubmit={(searchValue) => {
                    navigate({
                        search: {
                            ...search,
                            search: searchValue || undefined,
                            pageIndex: 1,
                        },
                    })
                }}
            />
            <div className='overflow-hidden rounded-md border'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className='group/row'>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className={cn(
                                                'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                                                header.column.columnDef.meta?.className ?? ''
                                            )}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                    className='group/row'
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={cn(
                                                'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                                                cell.column.columnDef.meta?.className ?? ''
                                            )}
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
                                    colSpan={columns.length}
                                    className='h-24 text-center'
                                >
                                    {t('table.noResults')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} className='mt-auto' />
        </div>
    )
}

