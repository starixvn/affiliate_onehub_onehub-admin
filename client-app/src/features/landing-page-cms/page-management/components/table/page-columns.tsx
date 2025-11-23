import { type ColumnDef } from '@tanstack/react-table'
import { type TFunction } from 'i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { IframeHoverPreview } from '@/components/iframe-hover-preview'
import { type LandingPage } from '../../data/schema'
import { PageStatusCell } from './page-status-cell'
import { DataTableRowActions } from './data-table-row-actions'

export const getPageColumns = (
  t: TFunction<'page-management', undefined>,
  landingPageUrl?: string
): ColumnDef<LandingPage>[] => [
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
      />
    ),
    meta: {
      className: cn(
        'sticky md:table-cell start-0 z-20 rounded-tl-[inherit] w-11 min-w-11 border-e text-center'
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={t('table.columns.selectRow')}
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
    cell: ({ row }) => <div className='text-center'>{row.getValue('rowIdx')}</div>,
    meta: {
      className: cn('sticky start-11 z-10 w-12 min-w-12 border-e'),
      displayName: t('table.columns.no'),
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'lpCode',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('table.columns.lpCode')} />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-48'>{row.getValue('lpCode')}</LongText>
    ),
    meta: {
      displayName: t('table.columns.lpCode'),
      className: '',
    },
    enableSorting: false,
  },
  {
    accessorKey: 'lpName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('table.columns.lpName')} />
    ),
    cell: ({ row }) => {
      const lpName = row.getValue('lpName') as string
      const lpCode = row.getValue('lpCode') as string
      const targetLanguageCode = row.original.targetLanguageCode ?? '';
      const statusId = row.original.statusId
      const isCanPreview = statusId !== 2

      if (!isCanPreview || !landingPageUrl) {
        return <LongText className='max-w-64'>{lpName}</LongText>
      }

      const previewUrl = `${landingPageUrl}/${targetLanguageCode}/${lpCode}`

      return (
        <IframeHoverPreview src={previewUrl} disabled={!isCanPreview}>
          <a
            href={previewUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 dark:text-blue-500 hover:underline'
            onClick={(e) => e.stopPropagation()}
          >
            <LongText className='max-w-64'>{lpName}</LongText>
          </a>
        </IframeHoverPreview>
      )
    },
    meta: {
      displayName: t('table.columns.lpName'),
      className: '',
    },
    enableSorting: false,
  },
  {
    accessorKey: 'campaignCode',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('table.columns.campaignCode')}
      />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-48'>{row.getValue('campaignCode')}</LongText>
    ),
    meta: {
      displayName: t('table.columns.campaignCode'),
      className: '',
    },
    enableSorting: false,
  },
  {
    accessorKey: 'campaignName',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('table.columns.campaignName')}
      />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-64'>{row.getValue('campaignName')}</LongText>
    ),
    meta: {
      displayName: t('table.columns.campaignName'),
      className: '',
    },
    enableSorting: false,
  },
  {
    accessorKey: 'countryCode',
    header: () => null,
    cell: () => null,
    filterFn: (row, id, value) => {
      return value.includes(String(row.getValue(id)))
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'countryName',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('table.columns.country')}
      />
    ),
    cell: ({ row }) => (
      <div className='text-nowrap'>{row.getValue('countryName')}</div>
    ),
    meta: {
      displayName: t('table.columns.country'),
      className: '',
    },
    enableSorting: false,
  },
  {
    accessorKey: 'languageCode',
    header: () => null,
    cell: () => null,
    filterFn: (row, id, value) => {
      return value.includes(String(row.getValue(id)))
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'languageName',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('table.columns.language')}
      />
    ),
    cell: ({ row }) => (
      <div className='text-nowrap'>{row.getValue('languageName')}</div>
    ),
    meta: {
      displayName: t('table.columns.language'),
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
    accessorKey: 'createdBy',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('table.columns.createdBy')}
      />
    ),
    cell: ({ row }) => (
      <div className='text-nowrap'>{row.getValue('createdBy')}</div>
    ),
    meta: {
      displayName: t('table.columns.createdBy'),
      className: '',
    },
    enableSorting: false,
  },
  {
    accessorKey: 'modifiedDate',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('table.columns.modifiedDate')}
      />
    ),
    cell: ({ row }) => {
      const date = row.getValue('modifiedDate') as string
      const isValidDate = date && date !== '01/01/0001' && date !== '01/01/1970'
      return <div className='text-nowrap'>{isValidDate ? date : '-'}</div>
    },
    meta: {
      displayName: t('table.columns.modifiedDate'),
      className: '',
    },
    enableSorting: false,
  },
  {
    accessorKey: 'modifiedBy',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('table.columns.modifiedBy')}
      />
    ),
    cell: ({ row }) => {
      const modifiedBy = row.getValue('modifiedBy') as string
      return <div className='text-nowrap'>{modifiedBy || '-'}</div>
    },
    meta: {
      displayName: t('table.columns.modifiedBy'),
      className: '',
    },
    enableSorting: false,
  },
  {
    accessorKey: 'click',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('table.columns.click')} />
    ),
    cell: ({ row }) => (
      <div className='text-right'>{row.getValue('click')}</div>
    ),
    meta: {
      displayName: t('table.columns.click'),
      className: '',
    },
    enableSorting: false,
  },
  {
    accessorKey: 'registration',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('table.columns.registration')}
      />
    ),
    cell: ({ row }) => (
      <div className='text-right'>{row.getValue('registration')}</div>
    ),
    meta: {
      displayName: t('table.columns.registration'),
      className: '',
    },
    enableSorting: false,
  },
  {
    accessorKey: 'ftd',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t('table.columns.ftd')} />
    ),
    cell: ({ row }) => <div className='text-right'>{row.getValue('ftd')}</div>,
    meta: {
      displayName: t('table.columns.ftd'),
      className: '',
    },
    enableSorting: false,
  },
  {
    accessorKey: 'revenue',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('table.columns.revenue')}
      />
    ),
    cell: ({ row }) => (
      <div className='text-right'>${row.getValue('revenue')}</div>
    ),
    meta: {
      displayName: t('table.columns.revenue'),
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
    cell: PageStatusCell,
    meta: {
      displayName: t('table.columns.status'),
      className: '',
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
    meta: {
      className: 'w-10',
    },
  },
]
