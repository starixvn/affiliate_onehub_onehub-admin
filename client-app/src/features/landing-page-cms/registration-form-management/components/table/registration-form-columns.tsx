import { type PaginationState, type ColumnDef } from '@tanstack/react-table'
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
import type { RegisterFormDetail } from '../../data/schema'
import { useRegisterFormManagement } from '../registration-form-management-provider'
import { RegisterFormRowActions } from './registration-form-row-actions'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    className: string
    displayName?: string
  }
}

interface StatusCellProps {
  registerForm: RegisterFormDetail
}

function StatusCell({ registerForm }: StatusCellProps) {
  const { t } = useTranslation('registration-form-management')
  const { setOpen, setCurrentRow, setTargetStatusId } =
    useRegisterFormManagement()

  const handleStatusChange = (value: string) => {
    const statusId = parseInt(value)
    setCurrentRow(registerForm)
    setTargetStatusId(statusId)
    setOpen('status-change')
  }

  const isActive = registerForm.statusId === 1

  return (
    <Select
      value={registerForm.statusId.toString()}
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

export const useRegisterFormColumns = (
  bannerRootUrl?: string,
  pagination?: PaginationState
): ColumnDef<RegisterFormDetail>[] => {
  const { t } = useTranslation('registration-form-management')

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
      header: t('table.formName'),
      meta: {
        className: '',
        displayName: t('table.formName'),
      },
      cell: ({ row }) => (
        <div className='max-w-[200px] truncate font-medium'>
          {row.getValue('mediaName')}
        </div>
      ),
    },
    {
      accessorKey: 'fileName',
      header: t('table.fileName'),
      meta: {
        className: '',
        displayName: t('table.fileName'),
      },
      cell: ({ row }) => (
        <div>{(row.getValue('fileName') as string).split('/').pop()}</div>
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
        <div className='flex justify-center'>
          <StatusCell registerForm={row.original} />
        </div>
      ),
    },
    {
      id: 'actions',
      header: () => <div className='text-center'>{t('table.action')}</div>,
      cell: ({ row }) => (
        <div className='flex justify-center'>
          <RegisterFormRowActions row={row} />
        </div>
      ),
      enableHiding: false,
    },
  ]
}
