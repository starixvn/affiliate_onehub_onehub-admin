import { format, startOfDay, endOfDay, isSameDay } from 'date-fns'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { DateRangePicker } from '@/components/date-range-picker'

type DateRangeFilterProps = {
  title?: string
  from: Date | undefined
  to: Date | undefined
  onSelect: (range: { from: Date | undefined; to: Date | undefined }) => void
  minDate?: Date
  maxDate?: Date
}

export function DateRangeFilter({
  title = 'Date Range',
  from,
  to,
  onSelect,
  minDate,
  maxDate,
}: DateRangeFilterProps) {
  const hasDateRange = from && to

  const detectEntirePeriod = (
    currentFrom: Date | undefined,
    currentTo: Date | undefined
  ): boolean => {
    if (!currentFrom || !currentTo) return false

    const entirePeriodFrom =
      minDate ||
      startOfDay(
        new Date(
          new Date().getFullYear() - 2,
          new Date().getMonth(),
          new Date().getDate()
        )
      )
    const entirePeriodTo = maxDate || endOfDay(new Date())

    return (
      isSameDay(currentFrom, entirePeriodFrom) &&
      isSameDay(currentTo, entirePeriodTo)
    )
  }

  const formatDateRange = () => {
    if (from && to) {
      if (detectEntirePeriod(from, to)) {
        return 'Entire Period'
      }
      return `${format(from, 'MMM dd, yyyy')} - ${format(to, 'MMM dd, yyyy')}`
    }
    if (from) {
      return format(from, 'MMM dd, yyyy')
    }
    return null
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-9 border-dashed'>
          <PlusCircledIcon className='size-4' />
          {title}
          {hasDateRange && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <Badge
                variant='secondary'
                className='rounded-sm px-1 font-normal'
              >
                {formatDateRange()}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <DateRangePicker
          from={from}
          to={to}
          onSelect={onSelect}
          minDate={minDate}
          maxDate={maxDate}
        />
      </PopoverContent>
    </Popover>
  )
}
