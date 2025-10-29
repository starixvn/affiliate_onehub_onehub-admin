import { type StatusOption } from '@/components/ui/status-select'

export const status: StatusOption<string>[] = [
  {
    label: 'Draft',
    value: '0',
    color: 'orange',
  },
  {
    label: 'Active',
    value: '1',
    color: 'green',
  },
  {
    label: 'Paused',
    value: '2',
    color: 'blue',
  },
  {
    label: 'Inactive',
    value: '3',
    color: 'gray',
  },
]
