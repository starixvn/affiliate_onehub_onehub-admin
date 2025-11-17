import { type ColumnDef } from '@tanstack/react-table'
import { type TFunction } from 'i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { type LinkInfo } from '../../data/schema'
import { LinkStatusCell } from './link-status-cell'
import { DataTableRowActions } from './data-table-row-actions'

export const getLinkColumns = (
    t: TFunction<'link-management', undefined>
): ColumnDef<LinkInfo>[] => [
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
            accessorKey: 'linkName',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('table.columns.linkName')}
                    className='ps-3'
                />
            ),
            cell: ({ row }) => (
                <LongText className='max-w-64 ps-3 cursor-pointer text-blue-600 hover:underline'>
                    {row.getValue('linkName')}
                </LongText>
            ),
            meta: {
                className: cn(
                    'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
                    'sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
                ),
                displayName: t('table.columns.linkName'),
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'shortLink',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('table.columns.shortLink')}
                />
            ),
            cell: ({ row }) => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className='max-w-64 truncate'>{row.getValue('shortLink')}</div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{row.getValue('shortLink')}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ),
            meta: {
                displayName: t('table.columns.shortLink'),
                className: '',
            },
            enableSorting: false,
        },
        {
            accessorKey: 'domainName',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('table.columns.domainName')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-nowrap'>{row.getValue('domainName')}</div>
            ),
            meta: {
                displayName: t('table.columns.domainName'),
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
                <LongText className='max-w-48'>{row.getValue('campaignName')}</LongText>
            ),
            meta: {
                displayName: t('table.columns.campaignName'),
                className: '',
            },
            enableSorting: false,
        },
        {
            accessorKey: 'countryName',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('table.columns.countryName')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-nowrap'>{row.getValue('countryName')}</div>
            ),
            meta: {
                displayName: t('table.columns.countryName'),
                className: '',
            },
            enableSorting: false,
        },
        {
            accessorKey: 'channelName',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('table.columns.channelName')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-nowrap'>{row.getValue('channelName')}</div>
            ),
            meta: {
                displayName: t('table.columns.channelName'),
                className: '',
            },
            enableSorting: false,
        },
        {
            accessorKey: 'idCode',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('table.columns.idCode')}
                />
            ),
            cell: ({ row }) => (
                <div className='text-nowrap'>{row.getValue('idCode')}</div>
            ),
            meta: {
                displayName: t('table.columns.idCode'),
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
            accessorKey: 'avgFtdAmount',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('table.columns.avgFtdAmount')}
                />
            ),
            cell: ({ row }) => {
                const amount = row.getValue('avgFtdAmount') as number
                return (
                    <div className='text-right'>${amount.toFixed(2)}</div>
                )
            },
            meta: {
                displayName: t('table.columns.avgFtdAmount'),
                className: '',
            },
            enableSorting: false,
        },
        {
            accessorKey: 'statusName',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title={t('table.columns.status')}
                />
            ),
            cell: LinkStatusCell,
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
        },
    ]

