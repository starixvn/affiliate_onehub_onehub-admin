import { useEffect, useState } from 'react'
import { Controller, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Info } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { SingleSelect, MultipleSelect } from '@/components/dropdowns'
import { useGenerateLink, type DialogType } from './generate-link-provider'
import { useGetDomains, useGetLanguages } from '../api/queries'
import type { CampaignInfo, DomainInfo, LandingPageOption, ComponentInfo, TargetCountry } from '../types'
import { FormFieldError } from './form-field-error'

function getAvailableDomainsText(count: number): string {
  return `${count} available ${count > 1 ? 'domains' : 'domain'}`
}

export function GenerateLinkForm() {
  const { t } = useTranslation('link-generator')
  const { form, campaigns, countries, events, groups, channels, agencies, types, landingPages, setDialogOpen, generatedResult } = useGenerateLink()
  const { register, control, formState: { errors } } = form
  const isDisabled = !!generatedResult

  const selectedCountryCode = useWatch({ control, name: 'country' })
  const selectedEventIds = useWatch({ control, name: 'event' })

  const [selectedLandingPage, setSelectedLandingPage] = useState<LandingPageOption | null>(null)

  const { data: languages } = useGetLanguages(selectedCountryCode || '')

  useEffect(() => {
    if (selectedEventIds && events) {
      const eventIdArray = selectedEventIds.split(',').filter(Boolean)
      const eventCodesList = eventIdArray.map(id => {
        const event = events.find((e: ComponentInfo) => e.componentId === parseInt(id))
        return event?.componentCode || ''
      }).filter(Boolean)
      form.setValue('eventCodes', eventCodesList.join(','))
    } else {
      form.setValue('eventCodes', '')
    }
  }, [selectedEventIds, events, form])

  useEffect(() => {
    if (selectedLandingPage && selectedLandingPage.marketId) {
      const language = languages?.find((lang: TargetCountry) => lang.languageCode === selectedLandingPage.marketId)
      if (language) {
        form.setValue('language', language.languageCode || '')
        form.setValue('shortedLanguageCode', language.shortedLanguageCode || '')
      } else {
        form.setValue('language', '')
        form.setValue('shortedLanguageCode', '')
      }
    }
  }, [selectedLandingPage, languages, form])

  useEffect(() => {
    if (languages && languages.length > 0 && selectedCountryCode) {
      const currentLanguage = form.getValues('language')
      const currentShortedLanguageCode = form.getValues('shortedLanguageCode')

      if (!currentLanguage || !currentShortedLanguageCode) {
        const firstLanguage = languages[0]
        if (firstLanguage) {
          form.setValue('language', firstLanguage.languageCode || '')
          form.setValue('shortedLanguageCode', firstLanguage.shortedLanguageCode || '')
        }
      }
    }
  }, [languages, selectedCountryCode, form])

  const domainTypePrimary = selectedLandingPage?.pageType === 3 ? 0 : 1
  const domainTypeShortLink = 2

  const { data: domains } = useGetDomains(selectedCountryCode || '', domainTypePrimary)
  const { data: domainsForShortLink } = useGetDomains(selectedCountryCode || '', domainTypeShortLink)

  const handleCreateNew = (type: DialogType) => {
    setDialogOpen(type)
  }

  const handleLandingPageChange = (_value: string, option?: LandingPageOption | null) => {
    setSelectedLandingPage(option || null)

    if (option) {
      if (option.campaignId) {
        form.setValue('campaign', String(option.campaignId))
        form.setValue('campaignCode', option.campaignCode)
      }
      if (option.targetCountryCode) {
        form.setValue('country', String(option.targetCountryCode))
        form.setValue('language', '')
      }
      if (option.pageType) {
        form.setValue('pageType', option.pageType)
      }
      if (option.pageCode) {
        form.setValue('pageCode', option.pageCode)
      }
    } else {
      form.setValue('pageType', 0)
      form.setValue('pageCode', '')
    }
  }

  const handleCampaignChange = (_value: string, option?: CampaignInfo | null) => {
    if (option?.campaignCode) {
      form.setValue('campaignCode', option.campaignCode)
    }
  }

  const handleGroupChange = (_value: string, option?: ComponentInfo | null) => {
    if (option?.componentCode) {
      form.setValue('groupCode', option.componentCode)
    }
  }

  const handleChannelChange = (_value: string, option?: ComponentInfo | null) => {
    if (option?.componentCode) {
      form.setValue('channelCode', option.componentCode)
    }
  }

  const handleAgencyChange = (_value: string, option?: ComponentInfo | null) => {
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
    <div className='space-y-4'>
      <div className='space-y-2'>
        <h2 className='text-lg font-semibold tracking-tight'>Generate New Tracking Link</h2>
        <p className='text-xs text-muted-foreground'>Create a trackable link with custom parameters for campaign attribution</p>
      </div>

      <div className='border rounded-lg p-2 sm:p-4'>
        <div className='grid gap-4 sm:gap-6 md:grid-cols-2'>
          <div className='space-y-1.5'>
            <Label htmlFor='linkName' className='text-sm'>
              {t('form.linkName')} <span className='text-destructive'>{t('form.requiredField')}</span>
            </Label>
            <Input
              id='linkName'
              placeholder={t('form.linkNamePlaceholder')}
              {...register('linkName')}
              maxLength={200}
              disabled={isDisabled}
            />
            <FormFieldError message={errors.linkName?.message} />
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='identifierCode' className='text-sm'>{t('form.identifierCode')}</Label>
            <Input
              id='identifierCode'
              placeholder={t('form.identifierCodePlaceholder')}
              {...register('identifierCode')}
              maxLength={20}
              disabled={isDisabled}
            />
            <FormFieldError message={errors.identifierCode?.message} />
          </div>
        </div>
      </div>

      <div className='grid gap-2 sm:gap-4 md:grid-cols-2'>
        <div className='border rounded-lg p-4 space-y-2.5'>
          <div className='space-y-1.5'>
            <Label htmlFor='landingPage' className='text-sm'>{t('form.landingPage')}</Label>
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
            <Label htmlFor='campaign' className='text-sm'>{t('form.campaign')}</Label>
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
            <Label htmlFor='country' className='text-sm'>{t('form.country')}</Label>
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
            <Label htmlFor='language' className='text-sm'>{t('form.language')}</Label>
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
                      field.onChange(lang.shortedLanguageCode || '')
                    } else {
                      field.onChange('')
                      form.setValue('language', '')
                    }
                  }}
                  options={languages || []}
                  labelKey='languageName'
                  valueKey='shortedLanguageCode'
                  placeholder={t('form.languagePlaceholder')}
                  searchPlaceholder='Search language...'
                  disabled={isDisabled}
                />
              )}
            />
            <FormFieldError message={errors.language?.message} />
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='domainName' className='text-sm'>
              {t('form.domainName')} <span className='text-green-600 text-xs'>({getAvailableDomainsText(domains?.length || 0)})</span>
            </Label>
            <div className='flex flex-col sm:flex-row gap-2'>
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
            <FormFieldError message={errors.domainName?.message || errors.domainReservedNote?.message} />
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='shortDomain' className='text-sm'>
              {t('form.shortLinkName')} <span className='text-green-600 text-xs'>({getAvailableDomainsText(domainsForShortLink?.length || 0)})</span>
            </Label>
            <div className='flex flex-col sm:flex-row gap-1'>
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
              <div className='flex items-center gap-1 flex-1'>
                <span className='text-muted-foreground hidden sm:inline'>/</span>
                <div className='relative flex-1'>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-help' />
                    </TooltipTrigger>
                    <TooltipContent side='top'>
                      <p>Customized the last part of your short link. Use 5-20 characters, including letters and numbers.</p>
                    </TooltipContent>
                  </Tooltip>
                  <Input
                    id='custom-short-link'
                    placeholder={t('form.shortLinkValuePlaceholder')}
                    {...register('shortPath')}
                    className='flex-1 min-w-0 pl-9'
                    disabled={isDisabled}
                    maxLength={20}
                  />
                </div>
              </div>
            </div>
            <FormFieldError message={errors.shortDomain?.message || errors.shortPath?.message} />
          </div>
        </div>

        <div className='border rounded-lg p-4 space-y-2.5'>
          <div className='space-y-1.5'>
            <Label htmlFor='event' className='text-sm'>{t('form.event')}</Label>
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
            <Label htmlFor='group' className='text-sm'>{t('form.group')}</Label>
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
            <Label htmlFor='channel' className='text-sm'>{t('form.channel')}</Label>
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
            <Label htmlFor='agency' className='text-sm'>{t('form.agency')}</Label>
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
            <Label htmlFor='type' className='text-sm'>{t('form.type')}</Label>
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
            <Label htmlFor='note' className='text-sm'>{t('form.note')}</Label>
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
      </div>
    </div>
  )
}

