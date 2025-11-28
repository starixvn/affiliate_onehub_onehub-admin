import { Controller, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Info } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SingleSelect } from '@/components/dropdowns'
import { cn } from '@/lib/utils'
import { usePageBuilder } from './page-builder-provider'
import { useGetLanguages } from '../api/queries'
import { status } from '../data/data'
import { FormFieldError } from './form-field-error'
import type { CampaignInfo, TargetCountry } from '../types'
import type { PageBuilderFormValues } from '../data/schema'

type PageConfigurationFormProps = {
  form: UseFormReturn<PageBuilderFormValues>
  isDisabled: boolean
}

export function PageConfigurationForm({ form, isDisabled }: PageConfigurationFormProps) {
  const { t } = useTranslation('page-builder')
  const { campaigns, countries, setDialogOpen } = usePageBuilder()
  const { register, control, formState: { errors } } = form

  const selectedCountryCode = form.watch('country')
  const { data: languages } = useGetLanguages(selectedCountryCode || '')

  const handleCreateNew = (type: 'campaign') => {
    setDialogOpen(type)
  }

  const handleCampaignChange = (_value: string, option?: CampaignInfo | null) => {
    if (option?.campaignCode) {
      form.setValue('campaignCode', option.campaignCode)
    }
  }

  return (
    <div className='h-full rounded-lg border p-4 lg:col-span-3'>
      <div className='mb-4 flex items-center gap-2'>
        <h3 className='font-semibold'>{t('form.createNewPage')}</h3>
        <Tooltip>
          <TooltipTrigger>
            <Info className='text-muted-foreground h-4 w-4' />
          </TooltipTrigger>
          <TooltipContent>{t('form.pageConfigurationDetails')}</TooltipContent>
        </Tooltip>
      </div>

      <div className='space-y-4'>
        <div className='space-y-1.5'>
          <Label htmlFor='pageName'>
            {t('form.pageName')} <span className='text-destructive'>{t('form.requiredField')}</span>
          </Label>
          <Input
            id='pageName'
            placeholder={t('form.pageNamePlaceholder')}
            {...register('pageName')}
            maxLength={50}
            disabled={isDisabled}
            className={cn(errors.pageName ? 'border-destructive focus-visible:border-destructive' : '')}
          />
          <FormFieldError message={errors.pageName?.message} />
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='pageCode'>
            {t('form.pageCode')} <span className='text-destructive'>{t('form.requiredField')}</span>
          </Label>
          <Input
            id='pageCode'
            placeholder={t('form.pageCodePlaceholder')}
            {...register('pageCode', {
              onChange: (e) => {
                const value = e.target.value
                const pageCodePattern = /^[a-zA-Z0-9-_]+$/
                if (value && !pageCodePattern.test(value)) {
                  e.target.value = value.replace(/[^a-zA-Z0-9-_]/g, '')
                  form.setValue('pageCode', e.target.value)
                }
              },
            })}
            maxLength={50}
            disabled={isDisabled}
            className={cn(errors.pageCode ? 'border-destructive focus-visible:border-destructive' : '')}
          />
          <FormFieldError message={errors.pageCode?.message} />
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='campaign'>{t('form.campaign')}</Label>
          <Controller
            name='campaign'
            control={control}
            render={({ field }) => (
              <SingleSelect<CampaignInfo>
                value={field.value}
                onValueChange={(value, option) => {
                  field.onChange(value)
                  handleCampaignChange(value, option)
                }}
                options={campaigns || []}
                labelKey='campaignName'
                valueKey='campaignId'
                placeholder={t('form.campaignPlaceholder')}
                searchPlaceholder={t('form.searchCampaign')}
                onCreateNew={() => handleCreateNew('campaign')}
                formatOptionLabel={(option) => {
                  const campaign = option as CampaignInfo
                  return `${campaign.campaignCode} | ${campaign.campaignName}`
                }}
                disabled={isDisabled}
                className={cn(errors.campaign ? 'border-destructive focus-visible:border-destructive' : '')}
              />
            )}
          />
          <FormFieldError message={errors.campaign?.message} />
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='country'>{t('form.country')}</Label>
          <Controller
            name='country'
            control={control}
            render={({ field }) => (
              <SingleSelect
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value)
                  form.setValue('language', '')
                  form.setValue('shortedLanguageCode', '')
                }}
                options={countries || []}
                labelKey='targetCountryName'
                valueKey='targetCountryCode'
                placeholder={t('form.countryPlaceholder')}
                searchPlaceholder={t('form.searchCountry')}
                disabled={isDisabled}
                className={cn(errors.country ? 'border-destructive focus-visible:border-destructive' : '')}
              />
            )}
          />
          <FormFieldError message={errors.country?.message} />
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='language'>{t('form.language')}</Label>
          <Controller
            name='shortedLanguageCode'
            control={control}
            render={({ field }) => (
              <SingleSelect
                value={field.value}
                onValueChange={(_value, option) => {
                  if (option) {
                    const lang = option as TargetCountry
                    form.setValue('language', lang.languageCode || '', { shouldValidate: true })
                    field.onChange(lang.shortedLanguageCode || '')
                  } else {
                    field.onChange('')
                    form.setValue('language', '', { shouldValidate: true })
                  }
                }}
                options={languages || []}
                labelKey='languageName'
                valueKey='shortedLanguageCode'
                placeholder={t('form.languagePlaceholder')}
                searchPlaceholder={t('form.searchLanguage')}
                disabled={isDisabled}
                className={cn(
                  (errors.language || errors.shortedLanguageCode) && !errors.modules?.message
                    ? 'border-destructive focus-visible:border-destructive'
                    : ''
                )}
              />
            )}
          />
          <FormFieldError 
            message={
              (errors.language?.message && !errors.modules?.message) 
                ? errors.language.message
                : (errors.shortedLanguageCode?.message && !errors.modules?.message)
                ? errors.shortedLanguageCode?.message
                : undefined
            } 
          />
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='statusId'>{t('form.pageStatus')}</Label>
          <Controller
            name='statusId'
            control={control}
            render={({ field }) => (
              <Select
                value={String(field.value ?? 0)}
                onValueChange={(value) => field.onChange(Number(value))}
                disabled={isDisabled}
              >
                <SelectTrigger className={cn(errors.statusId ? 'border-destructive focus-visible:border-destructive' : '')}>
                  <SelectValue placeholder={t('form.statusPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {status.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FormFieldError message={errors.statusId?.message} />
        </div>
      </div>
    </div>
  )
}

