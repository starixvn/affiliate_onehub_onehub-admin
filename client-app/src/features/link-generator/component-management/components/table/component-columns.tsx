import { type ColumnDef } from '@tanstack/react-table'
import { type TFunction } from 'i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type Component } from '../../data/schema'
import { ComponentCategoryCell } from './component-category-cell'
import { ComponentStatusCell } from './component-status-cell'
import { DataTableRowActions } from './data-table-row-actions'

export const getComponentColumns = (
  t: TFunction<'component-management', undefined>
): ColumnDef<Component>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label={t('table.columns.select')}
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn('sticky md:table-cell start-0 z-10 rounded-tl-[inherit]'),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={t('table.columns.selectRow')}
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'rowIdx',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('table.columns.no')} />
    ),
    cell: ({ row }) => <div className='w-2'>{row.getValue('rowIdx')}</div>,
    meta: {
      className: cn('sticky start-6 z-10'),
      displayName: t('table.columns.no'),
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'componentCode',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('table.columns.code')}
        className='ps-3'
      />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-64 ps-3'>
        {row.getValue('componentCode')}
      </LongText>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'sticky start-8 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
      displayName: t('table.columns.code'),
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'componentName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('table.columns.name')} />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-64'>{row.getValue('componentName')}</LongText>
    ),
    meta: {
      displayName: t('table.columns.name'),
      className: '',
    },
    enableSorting: false,
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('table.columns.category')}
      />
    ),
    cell: ComponentCategoryCell,
    meta: {
      displayName: t('table.columns.category'),
      className: '',
    },
    enableSorting: false,
  },
  {
    accessorKey: 'createdDate',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('table.columns.createdDate')}
      />
    ),
    cell: ({ row }) => (
      <div className='text-nowrap'>{row.getValue('createdDate')}</div>
    ),
    meta: {
      displayName: t('table.columns.createdDate'),
      className: '',
    },
    enableSorting: false,
  },
  {
    accessorKey: 'creator',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('table.columns.createdBy')}
      />
    ),
    cell: ({ row }) => (
      <div className='text-nowrap'>{row.getValue('creator')}</div>
    ),
    meta: {
      displayName: t('table.columns.createdBy'),
      className: '',
    },
    enableSorting: false,
  },
  {
    accessorKey: 'updatedDate',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('table.columns.modifiedDate')}
      />
    ),
    cell: ({ row }) => (
      <div className='text-nowrap'>{row.getValue('updatedDate')}</div>
    ),
    meta: {
      displayName: t('table.columns.modifiedDate'),
      className: '',
    },
    enableSorting: false,
  },
  {
    accessorKey: 'updatedBy',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('table.columns.modifiedBy')}
      />
    ),
    cell: ({ row }) => (
      <div className='text-nowrap'>{row.getValue('updatedBy')}</div>
    ),
    meta: {
      displayName: t('table.columns.modifiedBy'),
      className: '',
    },
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('table.columns.status')}
      />
    ),
    cell: ComponentStatusCell,
    meta: {
      displayName: t('table.columns.status'),
      className: 'w-32',
    },
    filterFn: (row, id, value) => {
      return value.includes(String(row.getValue(id)))
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
