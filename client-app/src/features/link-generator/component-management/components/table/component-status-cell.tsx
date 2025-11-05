import { type Row } from '@tanstack/react-table'
import { toast } from 'sonner'
import { StatusSelect } from '@/components/ui/status-select'
import { status } from '../../data/data'
import { type Component } from '../../data/schema'

export function ComponentStatusCell({ row }: { row: Row<Component> }) {
  const handleStatusChange = (newStatus: string) => {
    toast.success(`Component status changed to ${newStatus === '1' ? 'Active' : 'Inactive'}`)
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
