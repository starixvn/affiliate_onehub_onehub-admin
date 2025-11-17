import { type StatusOption } from '@/components/ui/status-select'

export const status: StatusOption<string>[] = [
  {
    label: 'Active',
    value: '1',
    color: 'green',
  },
  {
    label: 'Inactive',
    value: '2',
    color: 'gray',
  },
]

