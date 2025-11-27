import { Controller, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Info } from 'lucide-react'
import { SingleSelect } from '@/components/dropdowns'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { PageBuilderFormValues } from '../data/schema'
import type { Module } from '../types'

type ModuleSelectFieldProps = {
  index: number
  form: UseFormReturn<PageBuilderFormValues>
  modules: Module[] | undefined
  isLoadingModules: boolean
  isErrorModules: boolean
  isDisabled: boolean
  hasError: boolean
  isFirstRow: boolean
  firstModule: Module | null
  availableModules: Module[]
  onYoutubeInfoClick?: () => void
  isYoutubeModule: boolean
}

export function ModuleSelectField({
  index,
  form,
  modules,
  isLoadingModules,
  isErrorModules,
  isDisabled,
  hasError,
  isFirstRow,
  firstModule,
  availableModules,
  onYoutubeInfoClick,
  isYoutubeModule,
}: ModuleSelectFieldProps) {
  const { t } = useTranslation('page-builder')
  const { control } = form

  return (
    <div className='col-span-4'>
      <div className='flex items-center gap-2'>
        <div className='flex-1 min-w-0'>
          <Controller
            name={`modules.${index}.moduleId`}
            control={control}
            render={({ field: moduleField }) => {
              const displayValue = isFirstRow && firstModule 
                ? String(firstModule.moduleId) 
                : (moduleField.value ? String(moduleField.value) : '')

              const moduleValue = form.getValues(`modules.${index}.moduleId`)
              const isModuleMissing = hasError && !moduleValue

              return (
                <SingleSelect
                  value={displayValue}
                  onValueChange={(_value, option) => {
                    if (isFirstRow) return
                    if (option) {
                      const module = option as Module
                      moduleField.onChange(module.moduleId)
                    } else {
                      moduleField.onChange(undefined)
                    }
                  }}
                  options={isLoadingModules || isErrorModules || !modules || modules.length === 0 ? [] : availableModules}
                  labelKey='moduleName'
                  valueKey='moduleId'
                  placeholder={
                    isLoadingModules
                      ? t('form.loadingModules')
                      : isErrorModules
                        ? t('form.errorLoadingModules')
                        : modules && modules.length > 0
                          ? t('form.selectModule')
                          : t('form.noModulesAvailable')
                  }
                  searchPlaceholder={t('form.searchModule')}
                  disabled={
                    isDisabled || 
                    isLoadingModules || 
                    isErrorModules || 
                    !modules || 
                    modules.length === 0 ||
                    isFirstRow
                  }
                  className={cn(
                    'max-w-full',
                    isFirstRow ? 'bg-muted/50 opacity-60 cursor-not-allowed' : '',
                    isModuleMissing ? 'border-destructive focus-visible:border-destructive' : ''
                  )}
                />
              )
            }}
          />
        </div>
        {isFirstRow && (
          <div className='flex-shrink-0 relative z-10'>
            <Tooltip>
              <TooltipTrigger>
                <Info className='text-muted-foreground h-4 w-4' />
              </TooltipTrigger>
              <TooltipContent>{t('form.firstModuleTooltip')}</TooltipContent>
            </Tooltip>
          </div>
        )}
        {isYoutubeModule && onYoutubeInfoClick && (
          <div className='flex-shrink-0 relative z-10'>
            <button
              type='button'
              onClick={onYoutubeInfoClick}
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              <Info className='h-4 w-4' />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

