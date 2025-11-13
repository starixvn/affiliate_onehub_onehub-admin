import { type Row } from '@tanstack/react-table'
import { StatusSelect } from '@/components/ui/status-select'
import { status } from '../data/data'
import type { MediaDetail } from '../schema'

interface MediaStatusCellProps {
  row: Row<MediaDetail>
  onStatusChange: (statusId: number, media: MediaDetail) => void
}

export function MediaStatusCell({ row, onStatusChange }: MediaStatusCellProps) {
  const handleStatusChange = (newStatus: string) => {
    const statusId = parseInt(newStatus)
    onStatusChange(statusId, row.original)
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
