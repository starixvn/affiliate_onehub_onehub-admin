import { useState, useEffect } from 'react'
import {
  startOfDay,
  endOfDay,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  subWeeks,
  isSameDay,
} from 'date-fns'
import { Check } from 'lucide-react'
import { type DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'

type DateRangePickerProps = {
  from: Date | undefined
  to: Date | undefined
  onSelect: (range: {
    from: Date | undefined
    to: Date | undefined
    preset?: string | null
  }) => void
  minDate?: Date
  maxDate?: Date
  disabledPresets?: string[]
}

type PresetOption = {
  id: string
  label: string
  getValue: () => DateRange
}

export function DateRangePicker({
  from,
  to,
  onSelect,
  minDate,
  maxDate,
  disabledPresets = [],
}: DateRangePickerProps) {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>({
    from,
    to,
  })
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)

  const presetOptions: PresetOption[] = [
    {
      id: 'today',
      label: 'Today',
      getValue: () => ({
        from: startOfDay(new Date()),
        to: endOfDay(new Date()),
      }),
    },
    {
      id: 'yesterday',
      label: 'Yesterday',
      getValue: () => ({
        from: startOfDay(subDays(new Date(), 1)),
        to: endOfDay(subDays(new Date(), 1)),
      }),
    },
    {
      id: 'thisWeek',
      label: 'This Week',
      getValue: () => ({
        from: startOfWeek(new Date(), { weekStartsOn: 0 }),
        to: endOfDay(new Date()),
      }),
    },
    {
      id: 'lastWeek',
      label: 'Last Week',
      getValue: () => {
        const lastWeek = subWeeks(new Date(), 1)
        return {
          from: startOfWeek(lastWeek, { weekStartsOn: 0 }),
          to: endOfWeek(lastWeek, { weekStartsOn: 0 }),
        }
      },
    },
    {
      id: 'thisMonth',
      label: 'This Month',
      getValue: () => ({
        from: startOfMonth(new Date()),
        to: endOfDay(new Date()),
      }),
    },
    {
      id: 'lastMonth',
      label: 'Last Month',
      getValue: () => {
        const lastMonth = subMonths(new Date(), 1)
        return {
          from: startOfMonth(lastMonth),
          to: endOfMonth(lastMonth),
        }
      },
    },
    {
      id: 'sinceLastMonth',
      label: 'Since Last Month',
      getValue: () => ({
        from: startOfMonth(subMonths(new Date(), 1)),
        to: endOfDay(new Date()),
      }),
    },
    {
      id: 'entirePeriod',
      label: 'Entire Period',
      getValue: () => ({
        from:
          minDate ||
          startOfDay(
            new Date(
              new Date().getFullYear() - 2,
              new Date().getMonth(),
              new Date().getDate()
            )
          ),
        to: maxDate || endOfDay(new Date()),
      }),
    },
  ]

  const detectMatchingPreset = (
    currentFrom: Date | undefined,
    currentTo: Date | undefined
  ): string | null => {
    if (!currentFrom || !currentTo) return null

    for (const preset of presetOptions) {
      const presetRange = preset.getValue()
      if (
        presetRange.from &&
        presetRange.to &&
        isSameDay(currentFrom, presetRange.from) &&
        isSameDay(currentTo, presetRange.to)
      ) {
        return preset.id
      }
    }
    return null
  }

  useEffect(() => {
    setSelectedRange({ from, to })
    const matchingPreset = detectMatchingPreset(from, to)
    setSelectedPreset(matchingPreset)
  }, [from, to, minDate, maxDate])

  const handlePresetClick = (preset: PresetOption) => {
    const range = preset.getValue()
    setSelectedRange(range)
    setSelectedPreset(preset.id)
    onSelect({ from: range.from, to: range.to, preset: preset.id })
  }

  const handleDateSelect = (range: DateRange | undefined) => {
    setSelectedRange(range)
    setSelectedPreset(null)
    if (range?.from && range?.to) {
      onSelect({ from: range.from, to: range.to, preset: null })
    }
  }

  return (
    <div className='flex'>
      <div className='border-border flex flex-col gap-1 border-r p-3'>
        <div className='text-foreground mb-2 text-sm font-semibold'>
          Date Range
        </div>
        {presetOptions.map((preset) => {
          const isDisabled = disabledPresets.includes(preset.id)
          return (
            <button
              key={preset.id}
              onClick={() => !isDisabled && handlePresetClick(preset)}
              disabled={isDisabled}
              className={cn(
                'hover:bg-accent hover:text-accent-foreground relative flex w-full items-center justify-between rounded-md px-3 py-2 text-start text-sm transition-colors',
                selectedPreset === preset.id && 'bg-accent',
                isDisabled &&
                  'cursor-not-allowed opacity-50 hover:bg-transparent'
              )}
            >
              <span>{preset.label}</span>
              {selectedPreset === preset.id && <Check className='h-4 w-4' />}
            </button>
          )
        })}
      </div>
      <div className='p-3'>
        <Calendar
          mode='range'
          numberOfMonths={2}
          selected={selectedRange}
          onSelect={handleDateSelect}
          disabled={(date: Date) => {
            const max = maxDate || endOfDay(new Date())
            const min =
              minDate ||
              startOfDay(
                new Date(
                  new Date().getFullYear() - 2,
                  new Date().getMonth(),
                  new Date().getDate()
                )
              )
            return date > max || date < min
          }}
        />
      </div>
    </div>
  )
}