import { type Row } from '@tanstack/react-table'
import { StatusSelect } from '@/components/ui/status-select'
import { statuses } from '../../data/data'
import { type LandingPage } from '../../data/schema'
import { useLandingPages } from '../page-provider'

export function PageStatusCell({ row }: { row: Row<LandingPage> }) {
  const { setCurrentRow, setNewStatusId, setOpen } = useLandingPages()

  const handleStatusChange = (newStatus: string) => {
    setCurrentRow(row.original)
    setNewStatusId(Number(newStatus))
    setOpen('statusChange')
  }

  return (
    <StatusSelect
      value={String(row.original.statusId)}
      onValueChange={handleStatusChange}
      options={statuses}
      size='sm'
    />
  )
}
