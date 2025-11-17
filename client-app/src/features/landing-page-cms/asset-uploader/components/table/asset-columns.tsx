import { type PaginationState, type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@/components/ui/checkbox'
import { ImagePreviewCell } from '@/components/image-preview-cell'
import type { AssetDetail } from '../../data/schema'
import { AssetRowActions } from './asset-row-actions'
import { AssetStatusCell } from './asset-status-cell'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    className: string
    displayName?: string
  }
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
      meta: {
        className: 'whitespace-normal',
        displayName: t('table.fileName'),
      },
      cell: ({ row }) => (
        <div className='max-w-[200px] break-words font-medium'>
          {row.getValue('mediaName')}
        </div>
      ),
    },
    {
      accessorKey: 'moduleId',
      header: t('table.module'),
      meta: {
        className: 'whitespace-normal',
        displayName: t('table.module'),
      },
      cell: ({ row }) => (
        <div className='max-w-[200px] break-words'>{row.original.moduleName}</div>
      ),
    },
    {
      accessorKey: 'targetCountryCode',
      header: () => <div className='text-center'>{t('table.country')}</div>,
      meta: {
        className: '',
        displayName: t('table.country'),
      },
      cell: ({ row }) => (
        <div className='text-center'>{row.original.targetCountryName}</div>
      ),
    },
    {
      accessorKey: 'languageCode',
      header: () => <div className='text-center'>{t('table.language')}</div>,
      meta: {
        className: '',
        displayName: t('table.language'),
      },
      cell: ({ row }) => (
        <div className='text-center'>{row.original.marketName}</div>
      ),
    },
    {
      accessorKey: 'dimension',
      header: () => <div className='text-center'>{t('table.dimensions')}</div>,
      meta: {
        className: '',
        displayName: t('table.dimensions'),
      },
      cell: ({ row }) => (
        <div className='text-center'>{row.getValue('dimension')}</div>
      ),
    },
    {
      id: 'preview',
      header: () => (
        <div className='text-center'>{t('table.previewAsset')}</div>
      ),
      meta: {
        className: '',
        displayName: t('table.previewAsset'),
      },
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
      header: () => (
        <div className='text-center'>{t('table.status')}</div>
      ),
      meta: {
        className: '',
        displayName: t('table.status'),
      },
      cell: AssetStatusCell,
      filterFn: (row, id, value) => {
        return value.includes(String(row.getValue(id)))
      },
      enableHiding: false,
      enableSorting: false,
    },
    {
      id: 'actions',
      cell: AssetRowActions,
    },
  ]
}
