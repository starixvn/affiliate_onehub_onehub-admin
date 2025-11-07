import { type StatusOption } from '@/components/ui/status-select'

export const LANDING_PAGE_CATEGORY_ID = 6

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

export const categories = [
  { label: 'Event', value: '1' },
  { label: 'Group', value: '2' },
  { label: 'Channel', value: '3' },
  { label: 'Agency', value: '4' },
  { label: 'Type', value: '5' },
  { label: 'Landing Page', value: '6' },
]

export const deviceTypes = [
  { label: 'Mobile Only', value: '1' },
  { label: 'Mobile & Desktop', value: '2' },
]
