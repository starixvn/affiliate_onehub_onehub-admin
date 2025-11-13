import { useState } from 'react'
import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { SelectOption } from './select-types'

interface SingleSelectProps<T extends SelectOption = SelectOption> {
  value?: string
  onValueChange: (value: string, option?: T | null) => void
  options: T[] | Record<string, T[]>
  labelKey: string
  valueKey: string
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  onCreateNew?: () => void
  createNewLabel?: string
  className?: string
  formatOptionLabel?: (option: T) => string
}

function isGroupedOptions<T extends SelectOption>(options: T[] | Record<string, T[]>): options is Record<string, T[]> {
  return !Array.isArray(options)
}

export function SingleSelect<T extends SelectOption = SelectOption>({
  value,
  onValueChange,
  options,
  labelKey,
  valueKey,
  placeholder = 'Select option',
  searchPlaceholder = 'Search...',
  disabled = false,
  onCreateNew,
  createNewLabel = 'Create new...',
  className,
  formatOptionLabel,
}: SingleSelectProps<T>) {
  const [open, setOpen] = useState(false)

  const getLabel = (option: T): string => String(option[labelKey])
  const getValue = (option: T): string => String(option[valueKey])
  const getDisplayLabel = (option: T): string =>
    formatOptionLabel ? formatOptionLabel(option) : getLabel(option)

  const getSelectedLabel = () => {
    if (!value) return null

    if (isGroupedOptions(options)) {
      for (const groupOptions of Object.values(options)) {
        const found = groupOptions.find((opt: T) => getValue(opt) === value)
        if (found) return getDisplayLabel(found)
      }
    } else {
      const found = options.find((opt: T) => getValue(opt) === value)
      if (found) return getDisplayLabel(found)
    }
    return null
  }

  const handleSelect = (selectedOption: T) => {
    const optionValue = getValue(selectedOption)

    if (optionValue === value) {
      setOpen(false)
      return
    }

    onValueChange(optionValue, selectedOption)
    setOpen(false)
  }

  const handleCreateNew = () => {
    setOpen(false)
    onCreateNew?.()
  }

  const renderOptions = () => {
    if (isGroupedOptions(options)) {
      const entries = Object.entries(options)
      if (entries.length === 0) return null

      return entries.map(([groupLabel, groupOptions]) => (
        <CommandGroup key={groupLabel} heading={groupLabel}>
          {groupOptions.map((option) => (
            <CommandItem
              key={getValue(option)}
              value={getLabel(option)}
              onSelect={() => handleSelect(option)}
            >
              <Check
                className={cn(
                  'mr-2 h-4 w-4',
                  value === getValue(option) ? 'opacity-100' : 'opacity-0'
                )}
              />
              {getDisplayLabel(option)}
            </CommandItem>
          ))}
        </CommandGroup>
      ))
    }

    if (options.length === 0) return null

    return options.map((option) => (
      <CommandItem
        key={getValue(option)}
        value={getLabel(option)}
        onSelect={() => handleSelect(option)}
      >
        <Check
          className={cn(
            'mr-2 h-4 w-4',
            value === getValue(option) ? 'opacity-100' : 'opacity-0'
          )}
        />
        {getDisplayLabel(option)}
      </CommandItem>
    ))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          disabled={disabled}
          className={cn('w-full justify-between', className)}
        >
          {value ? getSelectedLabel() : placeholder}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[--radix-popover-trigger-width] p-0' side='bottom' align='start'>
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            {renderOptions()}
          </CommandList>
          {onCreateNew && (
            <>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem onSelect={handleCreateNew} className='cursor-pointer'>
                  <Plus className='mr-2 h-4 w-4' />
                  {createNewLabel}
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}

