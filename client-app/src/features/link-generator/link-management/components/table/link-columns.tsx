import { type ColumnDef } from '@tanstack/react-table'
import { type TFunction } from 'i18next'
import { Copy, Info } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { Button } from '@/components/ui/button'
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
      accessorKey: 'rowIdx',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title='#'
          className='text-center'
        />
      ),
      cell: ({ row }) => (
        <div className='text-center'>{row.getValue('rowIdx')}</div>
      ),
      meta: {
        className: '',
        displayName: '#',
      },
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
      cell: ({ row, table }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const context = (table.options.meta as Record<string, any>)?.linksContext
        return (
          <div className='ps-3 flex flex-col gap-1'>
            <div
              className='cursor-pointer text-blue-600 hover:underline'
              onClick={() => {
                if (context) {
                  context.setCurrentRow(row.original)
                  context.setOpen('detail')
                }
              }}
            >
              <LongText className='max-w-64'>
                {row.getValue('linkName')}
              </LongText>
            </div>
            <div className='text-xs text-muted-foreground'>
              {row.original.domainName}
            </div>
          </div>
        )
      },
      meta: {
        className: '',
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
          title={t('table.columns.shortUrl')}
        />
      ),
      cell: ({ row }) => {
        const shortLink = row.getValue('shortLink') as string
        const handleCopy = async () => {
          try {
            await navigator.clipboard.writeText(shortLink)
            toast.success(t('table.copySuccess'))
          } catch {
            toast.error(t('table.copyError'))
          }
        }

        return (
          <div className='flex items-center gap-2'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='max-w-64 truncate cursor-pointer'>
                    {shortLink}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{shortLink}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              variant='ghost'
              size='icon'
              className='h-6 w-6'
              onClick={handleCopy}
            >
              <Copy className='h-3.5 w-3.5' />
            </Button>
          </div>
        )
      },
      meta: {
        displayName: t('table.columns.shortUrl'),
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
          className='text-center'
        />
      ),
      cell: ({ row }) => (
        <div className='text-nowrap text-center'>{row.getValue('channelName')}</div>
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
          className='text-center'
        />
      ),
      cell: ({ row }) => (
        <div className='text-nowrap text-center'>{row.getValue('idCode')}</div>
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
      cell: ({ row }) => {
        const date = row.getValue('createdDate') as string
        const formattedDate = date ? format(new Date(date), 'yyyy-MM-dd') : ''
        return <div className='text-nowrap'>{formattedDate}</div>
      },
      meta: {
        displayName: t('table.columns.createdDate'),
        className: '',
      },
      enableSorting: false,
    },
    {
      accessorKey: 'click',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('table.columns.click')}
        />
      ),
      cell: ({ row }) => (
        <div className='text-center'>{row.getValue('click')}</div>
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
        <div className='flex items-center justify-center gap-1'>
          <DataTableColumnHeader
            column={column}
            title={t('table.columns.registration')}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className='h-3.5 w-3.5 text-muted-foreground cursor-help' />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('table.updateFrequency', { minutes: 5 })}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
      cell: ({ row }) => (
        <div className='text-center'>{row.getValue('registration')}</div>
      ),
      meta: {
        displayName: t('table.columns.registration'),
        className: '',
      },
      enableSorting: false,
    },
    {
      accessorKey: 'bonus',
      header: ({ column }) => (
        <div className='flex items-center justify-center gap-1'>
          <DataTableColumnHeader
            column={column}
            title={t('table.columns.bonusUser')}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className='h-3.5 w-3.5 text-muted-foreground cursor-help' />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('table.updateFrequency', { minutes: 45 })}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
      cell: ({ row }) => (
        <div className='text-center'>{row.getValue('bonus')}</div>
      ),
      meta: {
        displayName: t('table.columns.bonusUser'),
        className: '',
      },
      enableSorting: false,
    },
    {
      accessorKey: 'ftd',
      header: ({ column }) => (
        <div className='flex items-center justify-center gap-1'>
          <DataTableColumnHeader
            column={column}
            title={t('table.columns.ftd')}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className='h-3.5 w-3.5 text-muted-foreground cursor-help' />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('table.updateFrequency', { minutes: 11 })}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
      cell: ({ row }) => (
        <div className='text-center'>{row.getValue('ftd')}</div>
      ),
      meta: {
        displayName: t('table.columns.ftd'),
        className: '',
      },
      enableSorting: false,
    },
    {
      accessorKey: 'avgFtd',
      header: ({ column }) => (
        <div className='flex items-center justify-center gap-1'>
          <DataTableColumnHeader
            column={column}
            title={t('table.columns.avgFtdAmount')}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className='h-3.5 w-3.5 text-muted-foreground cursor-help' />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('table.updateFrequency', { minutes: 11 })}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
      cell: ({ row }) => {
        const amount = row.getValue('avgFtd') as number
        return <div className='text-center'>{(amount ?? 0).toFixed(2)}</div>
      },
      meta: {
        displayName: t('table.columns.avgFtdAmount'),
        className: '',
      },
      enableSorting: false,
    },
    {
      accessorKey: 'statusId',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('table.columns.status')}
          className='text-center'
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
      meta: {
        className: '',
      },
    },
  ]

