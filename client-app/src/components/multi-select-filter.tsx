import * as React from 'react'
import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
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
import { Separator } from '@/components/ui/separator'

type MultiSelectFilterProps<T extends string | number> = {
  title?: string
  options: {
    label: string
    value: T
    icon?: React.ComponentType<{ className?: string }>
  }[]
  selectedValues: T[]
  onValuesChange: (values: T[]) => void
  searchPlaceholder?: string
  maxDisplayCount?: number
}

export function MultiSelectFilter<T extends string | number>({
  title,
  options,
  selectedValues,
  onValuesChange,
  searchPlaceholder,
  maxDisplayCount = 0,
}: MultiSelectFilterProps<T>) {
  const selectedSet = new Set(selectedValues)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-9 border-dashed'>
          <PlusCircledIcon className='size-4' />
          {title}
          {selectedSet.size > 0 && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <Badge
                variant='secondary'
                className='rounded-sm px-1 font-normal lg:hidden'
              >
                {selectedSet.size}
              </Badge>
              <div className='hidden space-x-1 lg:flex'>
                {selectedSet.size > maxDisplayCount ? (
                  <Badge
                    variant='secondary'
                    className='rounded-sm px-1 font-normal'
                  >
                    {selectedSet.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedSet.has(option.value))
                    .map((option) => (
                      <Badge
                        variant='secondary'
                        key={String(option.value)}
                        className='rounded-sm px-1 font-normal'
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[220px] p-0' align='start'>
        <Command>
          <CommandInput placeholder={searchPlaceholder || title} />
          <CommandList className='max-h-[300px]'>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedSet.has(option.value)
                return (
                  <CommandItem
                    key={String(option.value)}
                    onSelect={() => {
                      const newSelectedSet = new Set(selectedSet)
                      if (isSelected) {
                        newSelectedSet.delete(option.value)
                      } else {
                        newSelectedSet.add(option.value)
                      }
                      const newValues = Array.from(newSelectedSet)
                      onValuesChange(newValues)
                    }}
                  >
                    <div
                      className={cn(
                        'border-primary flex size-4 items-center justify-center rounded-sm border',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <CheckIcon className={cn('text-background h-4 w-4')} />
                    </div>
                    {option.icon && (
                      <option.icon className='text-muted-foreground size-4' />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
          {selectedSet.size > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup className='bg-popover sticky bottom-0'>
                <CommandItem
                  onSelect={() => onValuesChange([])}
                  className='justify-center text-center'
                >
                  Clear filters
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
