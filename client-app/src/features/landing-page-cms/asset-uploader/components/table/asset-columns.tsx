import { type ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ImagePreviewCell } from '@/components/image-preview-cell'
import type { AssetDetail } from '../../data/schema'
import { AssetRowActions } from './asset-row-actions'
import { useUpdateAssetsStatus } from '../../api/commands'

function StatusCell({ mediaId, initialStatus }: { mediaId: number, initialStatus: number }) {
  const updateStatusMutation = useUpdateAssetsStatus()

  const handleStatusChange = (value: string) => {
    const statusId = parseInt(value)
    updateStatusMutation.mutate({ ids: mediaId.toString(), statusId })
  }

  const isActive = initialStatus === 1

  return (
    <Select value={initialStatus.toString()} onValueChange={handleStatusChange}>
      <SelectTrigger
        className={`h-8 w-[110px] ${
          isActive
            ? 'border-green-500 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-400'
            : 'border-red-500 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-400'
        }`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='1'>Active</SelectItem>
        <SelectItem value='2'>Inactive</SelectItem>
      </SelectContent>
    </Select>
  )
}

export const assetColumns = (
  bannerRootUrl?: string
): ColumnDef<AssetDetail>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'mediaId',
    header: '#',
    cell: ({ row }) => <div className='w-10'>{row.index + 1}</div>,
    enableHiding: false,
  },
  {
    accessorKey: 'mediaName',
    header: 'File Name',
    cell: ({ row }) => (
      <div className='max-w-[200px] truncate font-medium'>
        {row.getValue('mediaName')}
      </div>
    ),
  },
  {
    accessorKey: 'moduleName',
    header: 'Module',
    cell: ({ row }) => <div>{row.getValue('moduleName')}</div>,
  },
  {
    accessorKey: 'targetCountryName',
    header: () => <div className='text-center'>Country</div>,
    cell: ({ row }) => (
      <div className='text-center'>{row.getValue('targetCountryName')}</div>
    ),
  },
  {
    accessorKey: 'marketName',
    header: () => <div className='text-center'>Language</div>,
    cell: ({ row }) => (
      <div className='text-center'>{row.getValue('marketName')}</div>
    ),
  },
  {
    accessorKey: 'dimension',
    header: () => <div className='text-center'>Dimensions</div>,
    cell: ({ row }) => (
      <div className='text-center'>{row.getValue('dimension')}</div>
    ),
  },
  {
    id: 'preview',
    header: () => <div className='text-center'>Preview Asset</div>,
    cell: ({ row }) => {
      const mediaName = row.getValue('mediaName') as string
      const fileName = row.original.fileName
      const imageUrl = `${bannerRootUrl}/${fileName}`
      const thumbnailUrl = `${bannerRootUrl}/${fileName}`

      return (
        <ImagePreviewCell
          fileName={mediaName}
          imageUrl={imageUrl}
          thumbnailUrl={thumbnailUrl}
        />
      )
    },
  },
  {
    accessorKey: 'statusId',
    header: () => <div className='text-center'>Status</div>,
    cell: ({ row }) => {
      const status = row.getValue('statusId') as number
      return (
        <div className='flex justify-center'>
          <StatusCell initialStatus={status} mediaId={row.original.mediaId} />
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: () => <div className='text-center'>Action</div>,
    cell: ({ row }) => (
      <div className='flex justify-center'>
        <AssetRowActions row={row} />
      </div>
    ),
    enableHiding: false,
  },
]
