import { useState } from 'react'
import { type Row } from '@tanstack/react-table'
import { StatusSelect } from '@/components/ui/status-select'
import { useUpdateCampaign } from '../../api/commands'
import { status } from '../../data/data'
import { type Campaign } from '../../data/schema'
import { CampaignStatusChangeDialog } from '../dialog/campaign-status-change-dialog'

export function CampaignStatusCell({ row }: { row: Row<Campaign> }) {
  const updateMutation = useUpdateCampaign()
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
        disabled={updateMutation.isPending}
        size='sm'
      />

      {pendingStatusId !== null && (
        <CampaignStatusChangeDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          currentRow={row.original}
          newStatusId={pendingStatusId}
        />
      )}
    </>
  )
}
