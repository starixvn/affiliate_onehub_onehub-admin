import { type StatusOption } from '@/components/ui/status-select'

export const statuses: StatusOption<string>[] = [
  {
    label: 'Active',
    value: '1',
    color: 'green',
  },
  {
    label: 'Inactive',
    value: '0',
    color: 'gray',
  },
]

