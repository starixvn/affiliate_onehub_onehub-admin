import { type Row } from '@tanstack/react-table'
import { StatusSelect } from '@/components/ui/status-select'
import { status } from '../../data/data'
import { type RegisterFormDetail } from '../../data/schema'
import { useRegisterFormManagement } from '../registration-form-management-provider'

export function RegisterFormStatusCell({
  row,
}: {
  row: Row<RegisterFormDetail>
}) {
  const { setOpen, setCurrentRow, setTargetStatusId } =
    useRegisterFormManagement()

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
