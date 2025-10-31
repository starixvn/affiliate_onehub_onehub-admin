import { useState } from 'react'
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
import type { SelectOption, SelectGroup, NestedSelectGroup } from './select-types'

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
}

function isSelectOption(item: unknown): item is SelectOption {
  return typeof item === 'object' && item !== null && !isSelectGroup(item) && !isNestedSelectGroup(item)
}

function isSelectGroup(item: unknown): item is SelectGroup {
  return (item as SelectGroup).groupLabel !== undefined && (item as SelectGroup).options !== undefined && !(item as NestedSelectGroup).groups
}

function isNestedSelectGroup(item: unknown): item is NestedSelectGroup {
  return (item as NestedSelectGroup).groupLabel !== undefined && (item as NestedSelectGroup).groups !== undefined
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
}: MultipleSelectProps) {
  const [open, setOpen] = useState(false)

  const getLabel = (option: SelectOption): string => String(option[labelKey])
  const getValue = (option: SelectOption): string => String(option[valueKey])

  const getSelectedLabel = () => {
    if (value.length === 0) return null
    if (value.length === 1) {
      for (const item of options) {
        if (isSelectOption(item)) {
          if (getValue(item) === value[0]) return getLabel(item)
        } else if (isSelectGroup(item)) {
          const found = item.options.find((opt: SelectOption) => getValue(opt) === value[0])
          if (found) return getLabel(found)
        } else if (isNestedSelectGroup(item)) {
          if (item.options) {
            const found = item.options.find((opt: SelectOption) => getValue(opt) === value[0])
            if (found) return getLabel(found)
          }
          if (item.groups) {
            for (const group of item.groups) {
              const found = group.options.find((opt: SelectOption) => getValue(opt) === value[0])
              if (found) return getLabel(found)
            }
          }
        }
      }
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

  const getGroupCheckboxState = (groupOptions: SelectOption[]): boolean | 'indeterminate' => {
    const groupValues = groupOptions.map((opt) => getValue(opt))
    const selectedCount = groupValues.filter((v) => value.includes(v)).length
    
    if (selectedCount === 0) return false
    if (selectedCount === groupValues.length) return true
    return 'indeterminate'
  }

  const renderOptions = () => {
    if (options.length === 0) return null

    const firstItem = options[0]

    if (isSelectOption(firstItem)) {
      return (options as SelectOption[]).map((option) => (
        <CommandItem
          key={getValue(option)}
          value={getLabel(option)}
          onSelect={() => handleToggle(getValue(option))}
        >
          <Checkbox
            checked={value.includes(getValue(option))}
            className='mr-2'
          />
          {getLabel(option)}
        </CommandItem>
      ))
    }

    if (isSelectGroup(firstItem)) {
      return (options as SelectGroup[]).map((group) => {
        const checkboxState = getGroupCheckboxState(group.options)
        
        return (
          <CommandGroup key={group.groupLabel}>
            {enableGroupSelect && (
              <div 
                className='flex items-center px-2 py-1.5 cursor-pointer hover:bg-accent rounded-sm'
                onClick={() => handleToggleGroup(group.options)}
              >
                <Checkbox
                  checked={checkboxState}
                  className='mr-2'
                />
                <span className='text-muted-foreground text-xs font-medium'>
                  {group.groupLabel}
                </span>
              </div>
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
                {getLabel(option)}
              </CommandItem>
            ))}
          </CommandGroup>
        )
      })
    }

    if (isNestedSelectGroup(firstItem)) {
      return (options as NestedSelectGroup[]).map((topGroup) => {
        const allTopGroupOptions = [
          ...(topGroup.options || []),
          ...(topGroup.groups?.flatMap((g) => g.options) || []),
        ]
        const topCheckboxState = getGroupCheckboxState(allTopGroupOptions)
        
        return (
          <CommandGroup key={topGroup.groupLabel}>
            {enableGroupSelect && (
              <div 
                className='flex items-center px-2 py-1.5 cursor-pointer hover:bg-accent rounded-sm'
                onClick={() => handleToggleGroup(allTopGroupOptions)}
              >
                <Checkbox
                  checked={topCheckboxState}
                  className='mr-2'
                />
                <span className='text-muted-foreground text-xs font-medium'>
                  {topGroup.groupLabel}
                </span>
              </div>
            )}
            {!enableGroupSelect && (
              <div className='text-muted-foreground px-2 py-1.5 text-xs font-medium'>
                {topGroup.groupLabel}
              </div>
            )}
            {topGroup.options?.map((option) => (
              <CommandItem
                key={getValue(option)}
                value={getLabel(option)}
                onSelect={() => handleToggle(getValue(option))}
              >
                <Checkbox
                  checked={value.includes(getValue(option))}
                  className='mr-2'
                />
                {getLabel(option)}
              </CommandItem>
            ))}
            {topGroup.groups?.map((group) => {
              const subCheckboxState = getGroupCheckboxState(group.options)
              
              return (
                <div key={group.groupLabel} className='pl-2'>
                  {enableGroupSelect && (
                    <div 
                      className='flex items-center px-2 py-1.5 cursor-pointer hover:bg-accent rounded-sm'
                      onClick={() => handleToggleGroup(group.options)}
                    >
                      <Checkbox
                        checked={subCheckboxState}
                        className='mr-2'
                      />
                      <span className='text-muted-foreground text-xs font-medium'>
                        {group.groupLabel}
                      </span>
                    </div>
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
                      {getLabel(option)}
                    </CommandItem>
                  ))}
                </div>
              )
            })}
          </CommandGroup>
        )
      })
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
          {value.length > 0 ? getSelectedLabel() : placeholder}
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

