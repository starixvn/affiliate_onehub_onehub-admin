import { type Row } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { deviceTypes } from '../../data/data'
import { type Component } from '../../data/schema'

const deviceColors: Record<string, string> = {
  '1': 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-900/30 dark:text-cyan-400 dark:border-cyan-800',
  '2': 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800',
}

interface ComponentDeviceCellProps {
  row: Row<Component>
}

export function ComponentDeviceCell({ row }: ComponentDeviceCellProps) {
  const deviceType = row.original.deviceId
  const deviceLabel = deviceTypes.find(
    (d) => d.value === deviceType?.toString()
  )?.label

  if (!deviceType || !deviceLabel) {
    return <div className='text-nowrap'>-</div>
  }

  const colorClass = deviceColors[String(deviceType)] || deviceColors['1']

  return (
    <Badge variant='outline' className={`${colorClass} text-sm`}>
      {deviceLabel}
    </Badge>
  )
}
