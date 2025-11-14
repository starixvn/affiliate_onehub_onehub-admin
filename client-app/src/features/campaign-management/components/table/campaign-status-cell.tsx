import { useState } from 'react'
import { type Row } from '@tanstack/react-table'
import { StatusSelect } from '@/components/ui/status-select'
import { status } from '../../data/data'
import { type Campaign } from '../../data/schema'
import { CampaignStatusChangeDialog } from '../dialog/campaign-status-change-dialog'

export function CampaignStatusCell({ row }: { row: Row<Campaign> }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pendingStatusId, setPendingStatusId] = useState<number | null>(null)

  const handleStatusChange = (newStatus: string) => {
    const newStatusId = Number(newStatus)
    if (newStatusId === row.original.statusId) return

    setPendingStatusId(newStatusId)
    setDialogOpen(true)
  }

  return (
    <>
      <StatusSelect
        value={String(row.original.statusId)}
        onValueChange={handleStatusChange}
        options={status}
        disabled={false}
        size='sm'
      />

      {pendingStatusId !== null && (
        <CampaignStatusChangeDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) {
              setPendingStatusId(null)
            }
          }}
          currentRow={row.original}
          newStatusId={pendingStatusId}
        />
      )}
    </>
  )
}
