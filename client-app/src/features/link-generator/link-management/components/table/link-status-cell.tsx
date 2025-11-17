import { useState } from 'react'
import { type Row } from '@tanstack/react-table'
import { StatusSelect } from '@/components/ui/status-select'
import { statuses } from '../../data/link'
import { type LinkInfo } from '../../data/schema'
import { LinkStatusDialog } from '../dialog/link-status-dialog'

export function LinkStatusCell({ row }: { row: Row<LinkInfo> }) {
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
                options={statuses}
                disabled={false}
                size='sm'
            />

            {pendingStatusId !== null && (
                <LinkStatusDialog
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

