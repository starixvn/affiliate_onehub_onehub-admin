import { useState, useMemo, useEffect } from 'react'
import { Check, ChevronsUpDown, Plus, ChevronDown, ChevronRight } from 'lucide-react'
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
  defaultExpandAll?: boolean
  hasToggleButton?: boolean
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
  defaultExpandAll = true,
  hasToggleButton = true,
}: SingleSelectProps<T>) {
  const [open, setOpen] = useState(false)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSearchValue('')
    }
  }
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
  const [searchValue, setSearchValue] = useState('')

  const getLabel = (option: T): string => String(option[labelKey])
  const getValue = (option: T): string => String(option[valueKey])
  const getDisplayLabel = (option: T): string =>
    formatOptionLabel ? formatOptionLabel(option) : getLabel(option)

  const initialExpandedGroups = useMemo(() => {
    if (!isGroupedOptions(options)) return {}
    return Object.keys(options).reduce((acc, groupKey) => {
      acc[groupKey] = defaultExpandAll
      return acc
    }, {} as Record<string, boolean>)
  }, [options, defaultExpandAll])

  useEffect(() => {
    setExpandedGroups(initialExpandedGroups)
  }, [initialExpandedGroups])

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }))
  }

  const toggleAllGroups = () => {
    const allExpanded = Object.values(expandedGroups).every(expanded => expanded)
    const newState = Object.keys(expandedGroups).reduce((acc, groupKey) => {
      acc[groupKey] = !allExpanded
      return acc
    }, {} as Record<string, boolean>)
    setExpandedGroups(newState)
  }

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
      handleOpenChange(false)
      return
    }

    onValueChange(optionValue, selectedOption)
    handleOpenChange(false)
  }

  const handleCreateNew = () => {
    handleOpenChange(false)
    onCreateNew?.()
  }

  const renderOptions = () => {
    if (isGroupedOptions(options)) {
      const entries = Object.entries(options)
      if (entries.length === 0) return null

      const filteredEntries = searchValue.trim()
        ? entries
          .map(([groupLabel, groupOptions]) => {
            const filtered = groupOptions.filter(option =>
              getLabel(option).toLowerCase().includes(searchValue.toLowerCase()) ||
              getDisplayLabel(option).toLowerCase().includes(searchValue.toLowerCase())
            )
            return [groupLabel, filtered] as [string, T[]]
          })
          .filter(([_groupLabel, groupOptions]) => groupOptions.length > 0)
        : entries

      return filteredEntries.map(([groupLabel, groupOptions]) => {
        const isExpanded = searchValue.trim()
          ? true
          : (expandedGroups[groupLabel] ?? defaultExpandAll)
        const IconComponent = isExpanded ? ChevronDown : ChevronRight

        return (
          <CommandGroup
            key={groupLabel}
            heading={
              <button
                type="button"
                onClick={() => toggleGroup(groupLabel)}
                aria-expanded={isExpanded}
                className="flex items-center text-muted-foreground text-xs font-medium hover:text-foreground cursor-pointer w-full text-left"
              >
                <IconComponent className="mr-1 h-3 w-3" />
                {groupLabel}
              </button>
            }
          >
            {groupOptions.map((option) => (
              <CommandItem
                key={getValue(option)}
                value={getLabel(option)}
                onSelect={() => handleSelect(option)}
                className={cn(!isExpanded && "hidden")}
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
        )
      })
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
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          disabled={disabled}
          className={cn('w-full justify-between', className)}
        >
          {value && getSelectedLabel() ? (
            <span className='truncate flex-1 text-left' title={getSelectedLabel() || undefined}>
              {getSelectedLabel()}
            </span>
          ) : (
            <span className='truncate flex-1 text-left'>{placeholder}</span>
          )}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[--radix-popover-trigger-width] p-0' side='bottom' align='start'>
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          {hasToggleButton && isGroupedOptions(options) && Object.keys(options).length > 0 && !searchValue.trim() && (
            <div className="px-2 py-1 border-b">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={toggleAllGroups}
                className="h-6 text-xs px-2"
              >
                {Object.values(expandedGroups).every(expanded => expanded) ? 'Collapse All' : 'Expand All'}
              </Button>
            </div>
          )}
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

