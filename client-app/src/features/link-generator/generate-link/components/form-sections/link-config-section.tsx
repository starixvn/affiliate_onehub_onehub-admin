import { Controller } from 'react-hook-form'
import { Info, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import { SingleSelect } from '@/components/dropdowns'
import type {
  CampaignInfo,
  DomainInfo,
  LandingPageOption,
  TargetCountry,
} from '../../types'
import { FormFieldError } from '../form-field-error'
import { useGenerateLink, type DialogType } from '../generate-link-provider'
import { useLandingPageAutofill, useCountryOptions } from '../hooks'

function getAvailableDomainsText(count: number): string {
  return `${count} available ${count > 1 ? 'domains' : 'domain'}`
}

export function LinkConfigSection() {
  const { t } = useTranslation('link-generator')
  const {
    form,
    campaigns,
    countries,
    landingPages,
    setDialogOpen,
    generatedResult,
  } = useGenerateLink()
  const {
    register,
    control,
    formState: { errors },
  } = form
  const isDisabled = !!generatedResult

  const { languages } = useCountryOptions({ form, selectedLandingPage: null })
  const { selectedLandingPage, handleLandingPageChange } = useLandingPageAutofill({
    form,
    languages,
  })
  const { domains, domainsForShortLink } = useCountryOptions({
    form,
    selectedLandingPage,
  })

  const handleCreateNew = (type: DialogType) => {
    setDialogOpen(type)
  }

  const handleCampaignChange = (
    _value: string,
    option?: CampaignInfo | null
  ) => {
    if (option?.campaignCode) {
      form.setValue('campaignCode', option.campaignCode)
    }
  }

  return (
    <div className='space-y-2.5 rounded-lg border p-4'>
      <div className='space-y-1.5'>
        <Label htmlFor='landingPage' className='text-sm'>
          {t('form.landingPage')}
        </Label>
        <Controller
          name='landingPage'
          control={control}
          render={({ field }) => (
            <SingleSelect<LandingPageOption>
              value={field.value}
              onValueChange={(value, option) => {
                field.onChange(value)
                handleLandingPageChange(value, option)
              }}
              options={landingPages || {}}
              labelKey='pageName'
              valueKey='pageCode'
              placeholder={t('form.landingPagePlaceholder')}
              searchPlaceholder='Search landing page...'
              disabled={isDisabled}
            />
          )}
        />
        <FormFieldError message={errors.landingPage?.message} />
      </div>

      <div className='space-y-1.5'>
        <Label htmlFor='campaign' className='text-sm'>
          {t('form.campaign')}
        </Label>
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
              searchPlaceholder='Search campaign...'
              onCreateNew={() => handleCreateNew('campaign')}
              formatOptionLabel={(option) => {
                const campaign = option as CampaignInfo
                return `${campaign.campaignCode} | ${campaign.campaignName}`
              }}
              disabled={isDisabled}
            />
          )}
        />
        <FormFieldError message={errors.campaign?.message} />
      </div>

      <div className='space-y-1.5'>
        <Label htmlFor='country' className='text-sm'>
          {t('form.country')}
        </Label>
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
              searchPlaceholder='Search country...'
              disabled={isDisabled}
            />
          )}
        />
        <FormFieldError message={errors.country?.message} />
      </div>

      <div className='space-y-1.5'>
        <Label htmlFor='language' className='text-sm'>
          {t('form.language')}
        </Label>
        <Controller
          name='shortedLanguageCode'
          control={control}
          render={({ field }) => (
            <SingleSelect
              value={field.value}
              onValueChange={(_value, option) => {
                if (option) {
                  const lang = option as TargetCountry
                  form.setValue('language', lang.languageCode || '')
                  field.onChange(lang.targetLanguageCode || '')
                } else {
                  field.onChange('')
                  form.setValue('language', '')
                }
              }}
              options={languages || []}
              labelKey='languageName'
              valueKey='targetLanguageCode'
              placeholder={t('form.languagePlaceholder')}
              searchPlaceholder='Search language...'
              disabled={isDisabled}
            />
          )}
        />
        <FormFieldError message={errors.language?.message} />
      </div>

      <div className='space-y-1.5'>
        <div className='flex items-center gap-1'>
          <Label htmlFor='domainName' className='text-sm'>
            {t('form.domainName')}
          </Label>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='h-5 w-5'
          >
            <RefreshCw className='h-3.5 w-3.5' />
          </Button>
          <span className='text-xs text-green-600'>
            ({getAvailableDomainsText(domains?.length || 0)})
          </span>
        </div>
        <div className='flex flex-col gap-2 sm:flex-row'>
          <div className='w-full sm:w-80 sm:flex-shrink-0'>
            <Controller
              name='domainName'
              control={control}
              render={({ field }) => (
                <SingleSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={domains || []}
                  labelKey='domainName'
                  valueKey='domainName'
                  placeholder={t('form.domainNamePlaceholder')}
                  searchPlaceholder='Search domain...'
                  formatOptionLabel={(option) => {
                    const domain = option as DomainInfo
                    return `${domain.domainName} --- (Score: ${domain.score})`
                  }}
                  disabled={isDisabled}
                />
              )}
            />
          </div>
          <div className='flex-1'>
            <Input
              id='domainReservedNote'
              placeholder={t('form.domainReservedNotePlaceholder')}
              {...register('domainReservedNote')}
              required
              maxLength={200}
              disabled={isDisabled}
            />
          </div>
        </div>
        <FormFieldError
          message={
            errors.domainName?.message || errors.domainReservedNote?.message
          }
        />
      </div>

      <div className='space-y-1.5'>
        <div className='flex items-center gap-1'>
          <Label htmlFor='shortDomain' className='text-sm'>
            {t('form.shortLink')}
          </Label>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='h-5 w-5'
          >
            <RefreshCw className='h-3.5 w-3.5' />
          </Button>
          <span className='text-xs text-green-600'>
            ({getAvailableDomainsText(domainsForShortLink?.length || 0)})
          </span>
        </div>
        <div className='flex flex-col gap-1 sm:flex-row'>
          <div className='w-full sm:w-80 sm:flex-shrink-0'>
            <Controller
              name='shortDomain'
              control={control}
              render={({ field }) => (
                <SingleSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={domainsForShortLink || []}
                  labelKey='domainName'
                  valueKey='domainName'
                  placeholder={t('form.shortLinkNamePlaceholder')}
                  searchPlaceholder='Search short link...'
                  formatOptionLabel={(option) => {
                    const domain = option as DomainInfo
                    return `${domain.domainName} --- (Score: ${domain.score})`
                  }}
                  disabled={isDisabled}
                />
              )}
            />
          </div>
          <div className='flex flex-1 items-center gap-1'>
            <span className='text-muted-foreground hidden sm:inline'>
              /
            </span>
            <div className='relative flex-1'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 cursor-help' />
                </TooltipTrigger>
                <TooltipContent side='top'>
                  <p>{t('form.shortLinkValueTooltip')}</p>
                </TooltipContent>
              </Tooltip>
              <Input
                id='custom-short-link'
                placeholder={t('form.shortLinkValuePlaceholder')}
                {...register('shortPath')}
                className='min-w-0 flex-1 pl-9'
                disabled={isDisabled}
                maxLength={20}
              />
            </div>
          </div>
        </div>
        <FormFieldError
          message={errors.shortDomain?.message || errors.shortPath?.message}
        />
      </div>
    </div>
  )
}

