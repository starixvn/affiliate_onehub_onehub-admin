import { type PaginationState, type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@/components/ui/checkbox'
import { ImagePreviewCell } from '@/components/image-preview-cell'
import {
  MediaRowActions,
  MediaStatusCell,
} from '@/features/landing-page-cms/shared'
import { TRANSLATION_KEY, type RegisterFormDetail } from '../../data/schema'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    className: string
    displayName?: string
  }
}

export const useRegisterFormColumns = (
  bannerRootUrl?: string,
  pagination?: PaginationState,
  onEdit?: (form: RegisterFormDetail) => void,
  onDelete?: (form: RegisterFormDetail) => void,
  onStatusChange?: (statusId: number, form: RegisterFormDetail) => void
): ColumnDef<RegisterFormDetail>[] => {
  const { t } = useTranslation(TRANSLATION_KEY)

  return [
    {
      id: 'select',
      header: ({ table }) => (
        <div className='flex justify-center'>
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label={t('table.selectAll')}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className='flex justify-center'>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label={t('table.selectRow')}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'mediaId',
      header: () => <div className='text-center'>#</div>,
      cell: ({ row }) => (
        <div className='text-center'>
          {row.index +
            (pagination?.pageIndex ?? 0) * (pagination?.pageSize ?? 10) +
            1}
        </div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: 'mediaName',
      header: t('table.formName'),
      meta: {
        className: 'whitespace-normal',
        displayName: t('table.formName'),
      },
      cell: ({ row }) => (
        <div className='max-w-[200px] font-medium break-words'>
          {row.getValue('mediaName')}
        </div>
      ),
    },
    {
      accessorKey: 'fileName',
      header: t('table.fileName'),
      meta: {
        className: 'whitespace-normal',
        displayName: t('table.fileName'),
      },
      cell: ({ row }) => {
        const fileName = row.getValue('fileName')
        const fileNameStr = typeof fileName === 'string' ? fileName : ''
        const displayName = fileNameStr.includes('/')
          ? fileNameStr.split('/').pop() || ''
          : fileNameStr

        return (
          <div className='max-w-[200px] break-words'>{displayName}</div>
        )
      },
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
      accessorKey: 'preview',
      header: () => <div className='text-center'>{t('table.previewForm')}</div>,
      meta: {
        className: '',
        displayName: t('table.previewForm'),
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
      header: () => <div className='text-center'>{t('table.status')}</div>,
      meta: {
        className: '',
        displayName: t('table.status'),
      },
      cell: ({ row }) => (
        <MediaStatusCell
          row={row}
          onStatusChange={onStatusChange || (() => {})}
        />
      ),
      filterFn: (row, id, value) => {
        return value.includes(String(row.getValue(id)))
      },
      enableSorting: false,
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className='flex justify-center'>
          <MediaRowActions
            row={row}
            translationKey={TRANSLATION_KEY}
            onEdit={onEdit || (() => {})}
            onDelete={onDelete || (() => {})}
          />
        </div>
      ),
    },
  ]
}
