import { Play, FileText, Ban } from 'lucide-react'
import { type StatusOption } from '@/components/ui/status-select'

export const statuses: StatusOption<string>[] = [
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
    label: 'Inactive',
    value: '2',
    color: 'gray',
  },
]

export const statusesWithIcons = [
  {
    value: 1,
    label: 'Active',
    icon: Play,
    variant: 'success' as const,
  },
  {
    value: 0,
    label: 'Draft',
    icon: FileText,
    variant: 'warning' as const,
  },
  {
    value: 2,
    label: 'Inactive',
    icon: Ban,
    variant: 'secondary' as const,
  },
]
