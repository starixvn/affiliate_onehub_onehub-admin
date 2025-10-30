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
import type { SelectOption, SelectGroup, NestedSelectGroup } from './select-types'

interface SingleSelectProps {
  value?: string
  onValueChange: (value: string) => void
  options: SelectOption[] | SelectGroup[] | NestedSelectGroup[]
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  onCreateNew?: () => void
  createNewLabel?: string
  className?: string
}

function isSelectOption(item: unknown): item is SelectOption {
  return (item as SelectOption).value !== undefined
}

function isSelectGroup(item: unknown): item is SelectGroup {
  return (item as SelectGroup).groupLabel !== undefined && (item as SelectGroup).options !== undefined && !(item as NestedSelectGroup).groups
}

function isNestedSelectGroup(item: unknown): item is NestedSelectGroup {
  return (item as NestedSelectGroup).groupLabel !== undefined && (item as NestedSelectGroup).groups !== undefined
}

export function SingleSelect({
  value,
  onValueChange,
  options,
  placeholder = 'Select option',
  searchPlaceholder = 'Search...',
  disabled = false,
  onCreateNew,
  createNewLabel = 'Create new...',
  className,
}: SingleSelectProps) {
  const [open, setOpen] = useState(false)

  const getSelectedLabel = () => {
    if (!value) return null

    for (const item of options) {
      if (isSelectOption(item)) {
        if (item.value === value) return item.label
      } else if (isSelectGroup(item)) {
        const found = item.options.find((opt) => opt.value === value)
        if (found) return found.label
      } else if (isNestedSelectGroup(item)) {
        if (item.options) {
          const found = item.options.find((opt) => opt.value === value)
          if (found) return found.label
        }
        if (item.groups) {
          for (const group of item.groups) {
            const found = group.options.find((opt) => opt.value === value)
            if (found) return found.label
          }
        }
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

    if (isSelectOption(firstItem)) {
      return (options as SelectOption[]).map((option) => (
        <CommandItem
          key={option.value}
          value={option.label}
          onSelect={() => handleSelect(option.value)}
        >
          <Check
            className={cn(
              'mr-2 h-4 w-4',
              value === option.value ? 'opacity-100' : 'opacity-0'
            )}
          />
          {option.label}
        </CommandItem>
      ))
    }

    if (isSelectGroup(firstItem)) {
      return (options as SelectGroup[]).map((group) => (
        <CommandGroup key={group.groupLabel} heading={group.groupLabel}>
          {group.options.map((option) => (
            <CommandItem
              key={option.value}
              value={option.label}
              onSelect={() => handleSelect(option.value)}
            >
              <Check
                className={cn(
                  'mr-2 h-4 w-4',
                  value === option.value ? 'opacity-100' : 'opacity-0'
                )}
              />
              {option.label}
            </CommandItem>
          ))}
        </CommandGroup>
      ))
    }

    if (isNestedSelectGroup(firstItem)) {
      return (options as NestedSelectGroup[]).map((topGroup) => (
        <CommandGroup key={topGroup.groupLabel} heading={topGroup.groupLabel}>
          {topGroup.options?.map((option) => (
            <CommandItem
              key={option.value}
              value={option.label}
              onSelect={() => handleSelect(option.value)}
            >
              <Check
                className={cn(
                  'mr-2 h-4 w-4',
                  value === option.value ? 'opacity-100' : 'opacity-0'
                )}
              />
              {option.label}
            </CommandItem>
          ))}
          {topGroup.groups?.map((group) => (
            <div key={group.groupLabel} className='pl-2'>
              <div className='text-muted-foreground px-2 py-1.5 text-xs font-medium'>
                {group.groupLabel}
              </div>
              {group.options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </div>
          ))}
        </CommandGroup>
      ))
    }

    return null
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

