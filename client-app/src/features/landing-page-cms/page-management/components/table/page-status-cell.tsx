import { type Row } from '@tanstack/react-table'
import { StatusSelect } from '@/components/ui/status-select'
import { useUpdateBatchLandingPageStatus } from '../../api/commands'
import { statuses } from '../../data/data'
import { type LandingPage } from '../../data/schema'

export function PageStatusCell({ row }: { row: Row<LandingPage> }) {
  const updateMutation = useUpdateBatchLandingPageStatus()

  const handleStatusChange = (newStatus: string) => {
    updateMutation.mutate({
      pageIds: row.original.pageId.toString(),
      statusId: Number(newStatus),
    })
  }

  return (
    <StatusSelect
      value={String(row.original.statusId)}
      onValueChange={handleStatusChange}
      options={statuses}
      disabled={updateMutation.isPending}
      size='sm'
    />
  )
}

