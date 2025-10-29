import { type Row } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type AssetDetail } from '../../data/schema'
import { useAssetUploader } from '../asset-uploader-provider'

type AssetRowActionsProps = {
  row: Row<AssetDetail>
}

export function AssetRowActions({ row }: AssetRowActionsProps) {
  const { setOpen, setCurrentRow } = useAssetUploader()

  return (
    <div className='flex items-center gap-2'>
      <Button
        variant='ghost'
        size='icon'
        className='h-8 w-8'
        title='Edit asset'
        onClick={() => {
          setCurrentRow(row.original)
          setOpen('edit')
        }}
      >
        <Pencil className='h-4 w-4' />
      </Button>
      <Button
        disabled={row.original.isMediaIdInUse}
        variant='ghost'
        size='icon'
        className='h-8 w-8'
        title='Delete asset'
        onClick={() => {
          if (!row.original.isMediaIdInUse) {
            setCurrentRow(row.original)
            setOpen('delete')
          }
        }}
      >
        <Trash2 className='h-4 w-4' />
      </Button>
    </div>
  )
}