import { type Row } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { type Component } from '../../data/schema'
import { deviceTypes } from '../../data/data'

const deviceColors: Record<string, string> = {
  mobile:
    'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-900/30 dark:text-cyan-400 dark:border-cyan-800',
  desktop:
    'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800',
}

interface ComponentDeviceCellProps {
  row: Row<Component>
}

export function ComponentDeviceCell({ row }: ComponentDeviceCellProps) {
  const deviceType = row.original.deviceType
  const deviceLabel = deviceTypes.find((d) => d.value === deviceType)?.label

  if (!deviceType || !deviceLabel) {
    return <div className='text-nowrap'>-</div>
  }

  const colorClass = deviceColors[deviceType] || deviceColors.mobile

  return (
    <Badge variant='outline' className={`${colorClass} text-sm`}>
      {deviceLabel}
    </Badge>
  )
}
