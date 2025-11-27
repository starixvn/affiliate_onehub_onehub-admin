import { useState, type ReactNode } from 'react'
import { ChevronsUpDown, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import type {
  SelectOption,
  SelectGroup,
  NestedSelectGroup,
} from './select-types'

interface MultipleSelectProps {
  value: string[]
  onValueChange: (value: string[]) => void
  options: SelectOption[] | SelectGroup[] | NestedSelectGroup[]
  labelKey: string
  valueKey: string
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  selectedDisplayPattern?: string
  enableGroupSelect?: boolean
  onCreateNew?: () => void
  createNewLabel?: string
  className?: string
  renderOptionLabel?: (option: SelectOption) => ReactNode
}

function isSelectOption(item: unknown): item is SelectOption {
  return (
    typeof item === 'object' &&
    item !== null &&
    !('groupLabel' in item) &&
    !('options' in item) &&
    !('groups' in item)
  )
}

function isSelectGroup(item: unknown): item is SelectGroup {
  return (
    typeof item === 'object' &&
    item !== null &&
    'groupLabel' in item &&
    'options' in item &&
    Array.isArray((item as SelectGroup).options) &&
    !('groups' in item)
  )
}

function isNestedSelectGroup(item: unknown): item is NestedSelectGroup {
  return (
    typeof item === 'object' &&
    item !== null &&
    'groupLabel' in item &&
    'groups' in item &&
    Array.isArray((item as NestedSelectGroup).groups)
  )
}

function flattenOptions(
  options: SelectOption[] | SelectGroup[] | NestedSelectGroup[]
): SelectOption[] {
  const result: SelectOption[] = []

  for (const item of options) {
    if (isSelectOption(item)) {
      result.push(item)
    } else if (isSelectGroup(item)) {
      result.push(...item.options)
    } else if (isNestedSelectGroup(item)) {
      if (item.options) {
        result.push(...item.options)
      }
      if (item.groups) {
        for (const group of item.groups) {
          result.push(...group.options)
        }
      }
    }
  }

  return result
}

export function MultipleSelect({
  value = [],
  onValueChange,
  options,
  labelKey,
  valueKey,
  placeholder = 'Select options',
  searchPlaceholder = 'Search...',
  disabled = false,
  selectedDisplayPattern = '{0} items selected',
  enableGroupSelect = true,
  onCreateNew,
  createNewLabel = 'Create new...',
  className,
  renderOptionLabel,
}: MultipleSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSearchValue('')
    }
  }

  const getLabel = (option: SelectOption): string => String(option[labelKey])
  const getValue = (option: SelectOption): string => String(option[valueKey])
  const getDisplayContent = (option: SelectOption): ReactNode =>
    renderOptionLabel ? renderOptionLabel(option) : getLabel(option)

  const getSelectedLabel = () => {
    if (value.length === 0) return null
    if (value.length === 1) {
      const flatOptions = flattenOptions(options)
      const found = flatOptions.find((opt) => getValue(opt) === value[0])
      if (found) return getLabel(found)
    }
    return selectedDisplayPattern.replace('{0}', value.length.toString())
  }

  const handleToggle = (selectedValue: string) => {
    const newValue = value.includes(selectedValue)
      ? value.filter((v) => v !== selectedValue)
      : [...value, selectedValue]
    onValueChange(newValue)
  }

  const handleToggleGroup = (groupOptions: SelectOption[]) => {
    const groupValues = groupOptions.map((opt) => getValue(opt))
    const allSelected = groupValues.every((v) => value.includes(v))

    if (allSelected) {
      onValueChange(value.filter((v) => !groupValues.includes(v)))
    } else {
      const newValues = [...value]
      groupValues.forEach((v) => {
        if (!newValues.includes(v)) {
          newValues.push(v)
        }
      })
      onValueChange(newValues)
    }
  }

  const handleCreateNew = () => {
    setOpen(false)
    onCreateNew?.()
  }

  const getGroupCheckboxState = (
    groupOptions: SelectOption[]
  ): boolean | 'indeterminate' => {
    const groupValues = groupOptions.map((opt) => getValue(opt))
    const selectedCount = groupValues.filter((v) => value.includes(v)).length

    if (selectedCount === 0) return false
    if (selectedCount === groupValues.length) return true
    return 'indeterminate'
  }

  const matchesSearch = (option: SelectOption): boolean => {
    if (!searchValue.trim()) return true
    const search = searchValue.toLowerCase()
    return getLabel(option).toLowerCase().includes(search)
  }

  const renderOptions = () => {
    if (options.length === 0) return null

    const firstItem = options[0]

    if (isSelectOption(firstItem)) {
      const filteredOptions = (options as SelectOption[]).filter(matchesSearch)
      return filteredOptions.map((option) => (
        <CommandItem
          key={getValue(option)}
          value={getLabel(option)}
          onSelect={() => handleToggle(getValue(option))}
        >
          <Checkbox
            checked={value.includes(getValue(option))}
            className='mr-2'
          />
          {getDisplayContent(option)}
        </CommandItem>
      ))
    }

    if (isSelectGroup(firstItem)) {
      return (options as SelectGroup[])
        .map((group) => {
          const filteredOptions = group.options.filter(matchesSearch)
          if (filteredOptions.length === 0) return null

          const checkboxState = getGroupCheckboxState(filteredOptions)

          return (
            <CommandGroup key={group.groupLabel}>
              {enableGroupSelect && (
                <button
                  type='button'
                  className='hover:bg-accent flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5'
                  onClick={() => handleToggleGroup(filteredOptions)}
                  aria-label={`Toggle all ${group.groupLabel}`}
                >
                  <Checkbox checked={checkboxState} className='mr-2' />
                  <span className='text-muted-foreground text-sm font-medium'>
                    {group.groupLabel}
                  </span>
                </button>
              )}
              {!enableGroupSelect && (
                <div className='text-muted-foreground px-2 py-1.5 text-sm font-medium'>
                  {group.groupLabel}
                </div>
              )}
              {filteredOptions.map((option) => (
                <CommandItem
                  key={getValue(option)}
                  value={getLabel(option)}
                  onSelect={() => handleToggle(getValue(option))}
                >
                  <Checkbox
                    checked={value.includes(getValue(option))}
                    className='mr-2'
                  />
                  {getDisplayContent(option)}
                </CommandItem>
              ))}
            </CommandGroup>
          )
        })
        .filter(Boolean)
    }

    if (isNestedSelectGroup(firstItem)) {
      return (options as NestedSelectGroup[])
        .map((topGroup) => {
          const filteredTopOptions = (topGroup.options || []).filter(
            matchesSearch
          )
          const filteredSubGroups = (topGroup.groups || [])
            .map((g) => ({
              ...g,
              options: g.options.filter(matchesSearch),
            }))
            .filter((g) => g.options.length > 0)

          if (
            filteredTopOptions.length === 0 &&
            filteredSubGroups.length === 0
          ) {
            return null
          }

          const allTopGroupOptions = [
            ...filteredTopOptions,
            ...filteredSubGroups.flatMap((g) => g.options),
          ]
          const topCheckboxState = getGroupCheckboxState(allTopGroupOptions)

          return (
            <CommandGroup key={topGroup.groupLabel}>
              {enableGroupSelect && (
                <button
                  type='button'
                  className='hover:bg-accent flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5'
                  onClick={() => handleToggleGroup(allTopGroupOptions)}
                  aria-label={`Toggle all ${topGroup.groupLabel}`}
                >
                  <Checkbox checked={topCheckboxState} className='mr-2' />
                  <span className='text-muted-foreground text-xs font-medium'>
                    {topGroup.groupLabel}
                  </span>
                </button>
              )}
              {!enableGroupSelect && (
                <div className='text-muted-foreground px-2 py-1.5 text-xs font-medium'>
                  {topGroup.groupLabel}
                </div>
              )}
              {filteredTopOptions.map((option) => (
                <CommandItem
                  key={getValue(option)}
                  value={getLabel(option)}
                  onSelect={() => handleToggle(getValue(option))}
                >
                  <Checkbox
                    checked={value.includes(getValue(option))}
                    className='mr-2'
                  />
                  {getDisplayContent(option)}
                </CommandItem>
              ))}
              {filteredSubGroups.map((group) => {
                const subCheckboxState = getGroupCheckboxState(group.options)

                return (
                  <div key={group.groupLabel} className='pl-2'>
                    {enableGroupSelect && (
                      <button
                        type='button'
                        className='hover:bg-accent flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5'
                        onClick={() => handleToggleGroup(group.options)}
                        aria-label={`Toggle all ${group.groupLabel}`}
                      >
                        <Checkbox checked={subCheckboxState} className='mr-2' />
                        <span className='text-muted-foreground text-xs font-medium'>
                          {group.groupLabel}
                        </span>
                      </button>
                    )}
                    {!enableGroupSelect && (
                      <div className='text-muted-foreground px-2 py-1.5 text-xs font-medium'>
                        {group.groupLabel}
                      </div>
                    )}
                    {group.options.map((option) => (
                      <CommandItem
                        key={getValue(option)}
                        value={getLabel(option)}
                        onSelect={() => handleToggle(getValue(option))}
                      >
                        <Checkbox
                          checked={value.includes(getValue(option))}
                          className='mr-2'
                        />
                        {getDisplayContent(option)}
                      </CommandItem>
                    ))}
                  </div>
                )
              })}
            </CommandGroup>
          )
        })
        .filter(Boolean)
    }

    return null
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
          {value.length > 0 && getSelectedLabel() ? (
            <span
              className='flex-1 truncate text-left'
              title={getSelectedLabel() || undefined}
            >
              {getSelectedLabel()}
            </span>
          ) : (
            <span className='flex-1 truncate text-left'>{placeholder}</span>
          )}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-[--radix-popover-trigger-width] p-0'
        side='bottom'
        align='start'
      >
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            {renderOptions()}
          </CommandList>
          {onCreateNew && (
            <>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  onSelect={handleCreateNew}
                  className='cursor-pointer'
                >
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
