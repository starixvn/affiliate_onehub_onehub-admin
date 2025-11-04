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
import type { SelectOption, SelectGroup } from './select-types'

interface SingleSelectProps {
  value?: string
  onValueChange: (value: string) => void
  options: SelectOption[] | SelectGroup[]
  labelKey: string
  valueKey: string
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  onCreateNew?: () => void
  createNewLabel?: string
  className?: string
  formatOptionLabel?: (option: SelectOption) => string
}

function isSelectGroup(item: unknown): item is SelectGroup {
  return (item as SelectGroup).groupLabel !== undefined && (item as SelectGroup).options !== undefined
}

export function SingleSelect({
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
}: SingleSelectProps) {
  const [open, setOpen] = useState(false)

  const getLabel = (option: SelectOption): string => String(option[labelKey])
  const getValue = (option: SelectOption): string => String(option[valueKey])
  const getDisplayLabel = (option: SelectOption): string => 
    formatOptionLabel ? formatOptionLabel(option) : getLabel(option)

  const getSelectedLabel = () => {
    if (!value) return null

    for (const item of options) {
      if (isSelectGroup(item)) {
        const found = item.options.find((opt: SelectOption) => getValue(opt) === value)
        if (found) return getDisplayLabel(found)
      } else {
        if (getValue(item) === value) return getDisplayLabel(item)
      }
    }
    return null
  }

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue === value ? '' : selectedValue)
    setOpen(false)
  }

  const handleCreateNew = () => {
    setOpen(false)
    onCreateNew?.()
  }

  const renderOptions = () => {
    if (options.length === 0) return null

    const firstItem = options[0]

    if (isSelectGroup(firstItem)) {
      return (options as SelectGroup[]).map((group) => (
        <CommandGroup key={group.groupLabel} heading={group.groupLabel}>
          {group.options.map((option) => (
            <CommandItem
              key={getValue(option)}
              value={getLabel(option)}
              onSelect={() => handleSelect(getValue(option))}
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

    return (options as SelectOption[]).map((option) => (
      <CommandItem
        key={getValue(option)}
        value={getLabel(option)}
        onSelect={() => handleSelect(getValue(option))}
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

