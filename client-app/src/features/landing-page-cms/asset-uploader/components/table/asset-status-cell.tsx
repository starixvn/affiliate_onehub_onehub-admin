import { type Row } from '@tanstack/react-table'
import { StatusSelect } from '@/components/ui/status-select'
import { status } from '../../data/data'
import { type AssetDetail } from '../../data/schema'
import { useAssetUploader } from '../asset-uploader-provider'

export function AssetStatusCell({ row }: { row: Row<AssetDetail> }) {
  const { setOpen, setCurrentRow, setTargetStatusId } = useAssetUploader()

  const handleStatusChange = (newStatus: string) => {
    const statusId = parseInt(newStatus)
    setCurrentRow(row.original)
    setTargetStatusId(statusId)
    setOpen('status-change')
  }

  return (
    <StatusSelect
      value={String(row.original.statusId)}
      onValueChange={handleStatusChange}
      options={status}
      size='sm'
    />
  )
}

