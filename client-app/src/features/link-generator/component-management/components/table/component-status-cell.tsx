import { useState } from 'react'
import { type Row } from '@tanstack/react-table'
import { StatusSelect } from '@/components/ui/status-select'
import { useUpdateBatchComponentStatus } from '../../api/commands'
import { status } from '../../data/data'
import { type Component } from '../../data/schema'
import { ComponentStatusChangeDialog } from '../dialog/component-status-change-dialog'

export function ComponentStatusCell({ row }: { row: Row<Component> }) {
  const updateBatchStatusMutation = useUpdateBatchComponentStatus()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pendingStatusId, setPendingStatusId] = useState<number | null>(null)

  const handleStatusChange = (newStatus: string) => {
    const newStatusId = Number(newStatus)

    if (row.original.statusId === newStatusId) {
      return
    }

    setPendingStatusId(newStatusId)
    setDialogOpen(true)
  }

  return (
    <>
      <StatusSelect
        value={String(row.original.statusId)}
        onValueChange={handleStatusChange}
        options={status}
        disabled={updateBatchStatusMutation.isPending}
        size='sm'
      />

      {pendingStatusId !== null && (
        <ComponentStatusChangeDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          currentRow={row.original}
          newStatusId={pendingStatusId}
        />
      )}
    </>
  )
}
