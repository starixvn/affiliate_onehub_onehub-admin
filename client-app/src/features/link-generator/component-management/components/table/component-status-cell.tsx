import { type Row } from '@tanstack/react-table'
import { StatusSelect } from '@/components/ui/status-select'
import { useUpdateBatchComponentStatus } from '../../api/commands'
import { status } from '../../data/data'
import { type Component } from '../../data/schema'

export function ComponentStatusCell({ row }: { row: Row<Component> }) {
  const updateBatchStatusMutation = useUpdateBatchComponentStatus()

  const handleStatusChange = (newStatus: string) => {
    const newStatusId = Number(newStatus)

    if (row.original.statusId === newStatusId) {
      return
    }

    updateBatchStatusMutation.mutate({
      componentIds: String(row.original.componentId),
      statusId: newStatusId,
    })
  }

  return (
    <StatusSelect
      value={String(row.original.statusId)}
      onValueChange={handleStatusChange}
      options={status}
      disabled={updateBatchStatusMutation.isPending}
      size='sm'
    />
  )
}
