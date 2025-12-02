import { useFieldArray, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useGetModules } from '../api/queries'
import { FormFieldError } from './form-field-error'
import { ModuleRow } from './module-row'
import type { PageBuilderFormValues } from '../data/schema'

type ModuleComponentsSectionProps = {
  form: UseFormReturn<PageBuilderFormValues>
  isDisabled: boolean
}

export function ModuleComponentsSection({ form, isDisabled }: ModuleComponentsSectionProps) {
  const { t } = useTranslation('page-builder')
  const { control, formState: { errors } } = form
  const { data: modules, isLoading: isLoadingModules, isError: isErrorModules } = useGetModules()

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: 'modules',
  })

  const handleAddRow = (index: number) => {
    insert(index + 1, { moduleId: 0, sourceId: "", contactPath: undefined })
  }

  return (
    <div className='h-full rounded-lg border p-4 lg:col-span-6'>
      <h3 className='mb-4 font-semibold'>{t('form.moduleComponents')}</h3>

      <div className='space-y-4'>
        <div className='grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground'>
          <div className='col-span-1 text-center'>{t('form.order')}</div>
          <div className='col-span-4'>{t('form.module')}</div>
          <div className='col-span-4'>{t('form.source')}</div>
          <div className='col-span-3 text-center'>{t('form.action')}</div>
        </div>

        {(() => {
          const modulesError = errors.modules as { message?: string; _errors?: string[]; _root?: { message?: string } } | undefined
          const hasModulesError = !!(modulesError?.message || modulesError?._errors?.[0] || modulesError?._root?.message)

          return (
            <>
              {fields.map((field, index) => {
                const moduleValue = form.getValues(`modules.${index}`)
                const isModuleIncomplete = !moduleValue?.moduleId || !moduleValue?.sourceId
                const hasError = hasModulesError && isModuleIncomplete
              
                return (
                  <ModuleRow
                    key={field.id}
                    index={index}
                    form={form}
                    modules={modules}
                    isLoadingModules={isLoadingModules}
                    isErrorModules={isErrorModules}
                    isDisabled={isDisabled}
                    hasError={hasError}
                    onAdd={() => handleAddRow(index)}
                    onRemove={() => remove(index)}
                  />
                )
              })}
              <FormFieldError 
                message={
                  (modulesError?.message || 
                   modulesError?._errors?.[0] ||
                   modulesError?._root?.message) || undefined
                } 
              />
            </>
          )
        })()}

        {fields.length === 0 && (
          <div className='flex justify-center py-4'>
            <Button
              size='sm'
              variant='outline'
              className='h-8 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700'
              disabled={isDisabled}
              onClick={() => append({ moduleId: undefined, sourceId: undefined, contactPath: undefined })}
              type='button'
            >
              + {t('form.addModule')}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

