import { PaginationState, type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
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
import { useAssetUploader } from '../asset-uploader-provider'
import { AssetRowActions } from './asset-row-actions'

interface StatusCellProps {
  asset: AssetDetail
}

function StatusCell({ asset }: StatusCellProps) {
  const { t } = useTranslation('asset-uploader')
  const { setOpen, setCurrentRow, setTargetStatusId } = useAssetUploader()

  const handleStatusChange = (value: string) => {
    const statusId = parseInt(value)
    setCurrentRow(asset)
    setTargetStatusId(statusId)
    setOpen('status-change')
  }

  const isActive = asset.statusId === 1

  return (
    <Select
      value={asset.statusId.toString()}
      onValueChange={handleStatusChange}
    >
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
        <SelectItem value='1'>{t('table.active')}</SelectItem>
        <SelectItem value='2'>{t('table.inactive')}</SelectItem>
      </SelectContent>
    </Select>
  )
}

export const useAssetColumns = (
  bannerRootUrl?: string,
  pagination?: PaginationState
): ColumnDef<AssetDetail>[] => {
  const { t } = useTranslation('asset-uploader')

  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t('table.selectAll')}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t('table.selectRow')}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'mediaId',
      header: '#',
      cell: ({ row }) => (
        <div className='w-10'>
          {row.index +
            (pagination?.pageIndex ?? 0) * (pagination?.pageSize ?? 10) +
            1}
        </div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: 'mediaName',
      header: t('table.fileName'),
      cell: ({ row }) => (
        <div className='max-w-[200px] truncate font-medium'>
          {row.getValue('mediaName')}
        </div>
      ),
    },
    {
      accessorKey: 'moduleName',
      header: t('table.module'),
      cell: ({ row }) => <div>{row.getValue('moduleName')}</div>,
    },
    {
      accessorKey: 'targetCountryName',
      header: () => <div className='text-center'>{t('table.country')}</div>,
      cell: ({ row }) => (
        <div className='text-center'>{row.getValue('targetCountryName')}</div>
      ),
    },
    {
      accessorKey: 'marketName',
      header: () => <div className='text-center'>{t('table.language')}</div>,
      cell: ({ row }) => (
        <div className='text-center'>{row.getValue('marketName')}</div>
      ),
    },
    {
      accessorKey: 'dimension',
      header: () => <div className='text-center'>{t('table.dimensions')}</div>,
      cell: ({ row }) => (
        <div className='text-center'>{row.getValue('dimension')}</div>
      ),
    },
    {
      id: 'preview',
      header: () => (
        <div className='text-center'>{t('table.previewAsset')}</div>
      ),
      cell: ({ row }) => {
        const mediaName = row.getValue('mediaName') as string
        const fileName = row.original.fileName
        const imageUrl =
          bannerRootUrl && fileName ? `${bannerRootUrl}/${fileName}` : ''
        const thumbnailUrl =
          bannerRootUrl && fileName ? `${bannerRootUrl}/${fileName}` : ''

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
      header: () => <div className='text-center'>{t('table.status')}</div>,
      cell: ({ row }) => (
        <div className='flex justify-center'>
          <StatusCell asset={row.original} />
        </div>
      ),
    },
    {
      id: 'actions',
      header: () => <div className='text-center'>{t('table.action')}</div>,
      cell: ({ row }) => (
        <div className='flex justify-center'>
          <AssetRowActions row={row} />
        </div>
      ),
      enableHiding: false,
    },
  ]
}
