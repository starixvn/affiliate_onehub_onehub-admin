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
