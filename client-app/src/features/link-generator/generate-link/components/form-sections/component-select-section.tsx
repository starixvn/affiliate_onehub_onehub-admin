import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SingleSelect, MultipleSelect } from '@/components/dropdowns'
import type { ComponentInfo } from '../../types'
import { FormFieldError } from '../form-field-error'
import { useGenerateLink, type DialogType } from '../generate-link-provider'
import { useEventFormatter } from '../hooks'

export function ComponentSelectSection() {
  const { t } = useTranslation('link-generator')
  const {
    form,
    events,
    groups,
    channels,
    agencies,
    types,
    setDialogOpen,
    generatedResult,
  } = useGenerateLink()
  const {
    register,
    control,
    formState: { errors },
  } = form
  const isDisabled = !!generatedResult

  useEventFormatter({ form, events })

  const handleCreateNew = (type: DialogType) => {
    setDialogOpen(type)
  }

  const handleGroupChange = (_value: string, option?: ComponentInfo | null) => {
    if (option?.componentCode) {
      form.setValue('groupCode', option.componentCode)
    }
  }

  const handleChannelChange = (
    _value: string,
    option?: ComponentInfo | null
  ) => {
    if (option?.componentCode) {
      form.setValue('channelCode', option.componentCode)
    }
  }

  const handleAgencyChange = (
    _value: string,
    option?: ComponentInfo | null
  ) => {
    if (option?.componentCode) {
      form.setValue('agencyCode', option.componentCode)
    }
  }

  const handleTypeChange = (_value: string, option?: ComponentInfo | null) => {
    if (option?.componentCode) {
      form.setValue('typeCode', option.componentCode)
    }
  }

  return (
    <div className='space-y-2.5 rounded-lg border p-4'>
      <div className='space-y-1.5'>
        <Label htmlFor='event' className='text-sm'>
          {t('form.event')}
        </Label>
        <Controller
          name='event'
          control={control}
          render={({ field }) => (
            <MultipleSelect
              value={field.value ? field.value.split(',') : []}
              onValueChange={(value) => field.onChange(value.join(','))}
              options={events || []}
              labelKey='componentName'
              valueKey='componentId'
              placeholder={t('form.eventPlaceholder')}
              searchPlaceholder='Search event...'
              selectedDisplayPattern='{0} events selected'
              onCreateNew={() => handleCreateNew('event')}
              disabled={isDisabled}
            />
          )}
        />
        <FormFieldError message={errors.event?.message} />
      </div>

      <div className='space-y-1.5'>
        <Label htmlFor='group' className='text-sm'>
          {t('form.group')}
        </Label>
        <Controller
          name='group'
          control={control}
          render={({ field }) => (
            <SingleSelect<ComponentInfo>
              value={field.value}
              onValueChange={(value, option) => {
                field.onChange(value)
                handleGroupChange(value, option)
              }}
              options={groups || []}
              labelKey='componentName'
              valueKey='componentId'
              placeholder={t('form.groupPlaceholder')}
              searchPlaceholder='Search group...'
              onCreateNew={() => handleCreateNew('group')}
              disabled={isDisabled}
            />
          )}
        />
        <FormFieldError message={errors.group?.message} />
      </div>

      <div className='space-y-1.5'>
        <Label htmlFor='channel' className='text-sm'>
          {t('form.channel')}
        </Label>
        <Controller
          name='channel'
          control={control}
          render={({ field }) => (
            <SingleSelect<ComponentInfo>
              value={field.value}
              onValueChange={(value, option) => {
                field.onChange(value)
                handleChannelChange(value, option)
              }}
              options={channels || []}
              labelKey='componentName'
              valueKey='componentId'
              placeholder={t('form.channelPlaceholder')}
              searchPlaceholder='Search channel...'
              onCreateNew={() => handleCreateNew('channel')}
              disabled={isDisabled}
            />
          )}
        />
        <FormFieldError message={errors.channel?.message} />
      </div>

      <div className='space-y-1.5'>
        <Label htmlFor='agency' className='text-sm'>
          {t('form.agency')}
        </Label>
        <Controller
          name='agency'
          control={control}
          render={({ field }) => (
            <SingleSelect<ComponentInfo>
              value={field.value}
              onValueChange={(value, option) => {
                field.onChange(value)
                handleAgencyChange(value, option)
              }}
              options={agencies || []}
              labelKey='componentName'
              valueKey='componentId'
              placeholder={t('form.agencyPlaceholder')}
              searchPlaceholder='Search agency...'
              onCreateNew={() => handleCreateNew('agency')}
              disabled={isDisabled}
            />
          )}
        />
        <FormFieldError message={errors.agency?.message} />
      </div>

      <div className='space-y-1.5'>
        <Label htmlFor='type' className='text-sm'>
          {t('form.type')}
        </Label>
        <Controller
          name='type'
          control={control}
          render={({ field }) => (
            <SingleSelect<ComponentInfo>
              value={field.value}
              onValueChange={(value, option) => {
                field.onChange(value)
                handleTypeChange(value, option)
              }}
              options={types || []}
              labelKey='componentName'
              valueKey='componentId'
              placeholder={t('form.typePlaceholder')}
              searchPlaceholder='Search type...'
              onCreateNew={() => handleCreateNew('type')}
              disabled={isDisabled}
            />
          )}
        />
        <FormFieldError message={errors.type?.message} />
      </div>

      <div className='space-y-1.5'>
        <Label htmlFor='note' className='text-sm'>
          {t('form.note')}
        </Label>
        <Input
          id='note'
          placeholder={t('form.notePlaceholder')}
          {...register('note')}
          maxLength={500}
          disabled={isDisabled}
        />
        <FormFieldError message={errors.note?.message} />
      </div>
    </div>
  )
}

