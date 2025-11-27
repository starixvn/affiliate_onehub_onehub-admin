import { type StatusOption } from '@/components/ui/status-select'

export type ComponentType = 'event' | 'group' | 'channel' | 'agency' | 'type'

export const COMPONENT_CONFIG: Record<
  ComponentType,
  {
    label: string
    categoryId: number
  }
> = {
  event: { label: 'Event', categoryId: 1 },
  group: { label: 'Group', categoryId: 2 },
  channel: { label: 'Channel', categoryId: 3 },
  agency: { label: 'Agency', categoryId: 4 },
  type: { label: 'Type', categoryId: 5 },
}

export const componentTypes = Object.keys(COMPONENT_CONFIG) as ComponentType[]

export const STATUS_IDS = {
  DRAFT: 0,
  ACTIVE: 1,
  PAUSED: 2,
  INACTIVE: 3,
} as const

export const status: StatusOption<string>[] = [
  {
    label: 'Draft',
    value: String(STATUS_IDS.DRAFT),
    color: 'orange',
  },
  {
    label: 'Active',
    value: String(STATUS_IDS.ACTIVE),
    color: 'green',
  },
  {
    label: 'Paused',
    value: String(STATUS_IDS.PAUSED),
    color: 'blue',
  },
  {
    label: 'Inactive',
    value: String(STATUS_IDS.INACTIVE),
    color: 'gray',
  },
]
