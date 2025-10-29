import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type StatusColor =
  | 'green'
  | 'orange'
  | 'blue'
  | 'red'
  | 'gray'
  | 'purple'
  | 'yellow'
  | 'pink'

export type StatusOption<T = string> = {
  label: string
  value: T
  color: StatusColor
}

type StatusSelectProps<T = string> = {
  value?: T
  onValueChange?: (value: T) => void
  options: StatusOption<T>[]
  placeholder?: string
  disabled?: boolean
  className?: string
  size?: 'sm' | 'default'
}

const colorVariants: Record<StatusColor, string> = {
  green: 'bg-green-100 text-green-800',
  orange: 'bg-orange-100 text-orange-800',
  blue: 'bg-blue-100 text-blue-800',
  red: 'bg-red-100 text-red-800',
  gray: 'bg-gray-100 text-gray-800',
  purple: 'bg-purple-100 text-purple-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  pink: 'bg-pink-100 text-pink-800',
}

export function StatusSelect<T extends string | number>({
  value,
  onValueChange,
  options,
  placeholder = 'Select status',
  disabled = false,
  className,
  size = 'default',
}: StatusSelectProps<T>) {
  const selectedOption = options.find(
    (opt) => String(opt.value) === String(value)
  )

  return (
    <Select
      value={value ? String(value) : undefined}
      onValueChange={(val) => {
        const option = options.find((opt) => String(opt.value) === val)
        if (option && onValueChange) {
          onValueChange(option.value)
        }
      }}
      disabled={disabled}
    >
      <SelectTrigger size={size} className={cn('w-full', className)}>
        <SelectValue placeholder={placeholder}>
          {selectedOption && (
            <Badge
              variant='secondary'
              className={cn('text-sm', colorVariants[selectedOption.color])}
            >
              {selectedOption.label}
            </Badge>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <div className='flex flex-col gap-2'>
          {options.map((option) => {
            const isCurrentValue = String(option.value) === String(value)
            return (
              <SelectItem
                key={String(option.value)}
                value={String(option.value)}
                disabled={isCurrentValue}
              >
                <Badge
                  variant='secondary'
                  className={cn('text-sm', colorVariants[option.color])}
                >
                  {option.label}
                </Badge>
              </SelectItem>
            )
          })}
        </div>
      </SelectContent>
    </Select>
  )
}
