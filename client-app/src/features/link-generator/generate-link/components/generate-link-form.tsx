import { useEffect } from 'react'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SingleSelect, MultipleSelect } from '@/components/dropdowns'
import { useGenerateLink, type DialogType } from './generate-link-provider'
import { useGetLanguagesByCountry } from '../api/queries'
import type { CampaignInfo } from '../types'

export function GenerateLinkForm() {
  const { t } = useTranslation('link-generator')
  const { form, campaigns, countries, events, groups, channels, agencies, types, landingPages, setDialogOpen } = useGenerateLink()
  const { register, control, watch } = form

  const selectedCountry = watch('country')

  const { data: languages = [], isLoading: isLoadingLanguages } = useGetLanguagesByCountry(selectedCountry || '')

  useEffect(() => {
    if (selectedCountry && languages.length > 0) {
      form.setValue('language', languages[0].targetCountryCode)
    } else if (!selectedCountry) {
      form.setValue('language', '')
    }
  }, [selectedCountry, languages, form])

  const handleCreateNew = (type: DialogType) => {
    setDialogOpen(type)
  }

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <h2 className='text-lg font-semibold tracking-tight'>Generate New Tracking Link</h2>
        <p className='text-xs text-muted-foreground'>Create a trackable link with custom parameters for campaign attribution</p>
      </div>

      <div className='border rounded-lg p-2 sm:p-4'>
        <div className='grid gap-4 sm:gap-6 md:grid-cols-2'>
          <div className='space-y-2'>
            <Label htmlFor='linkName' className='text-sm'>
              {t('form.linkName')} <span className='text-destructive'>{t('form.requiredField')}</span>
            </Label>
            <Input
              id='linkName'
              placeholder={t('form.linkNamePlaceholder')}
              {...register('linkName')}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='identifierCode' className='text-sm'>{t('form.identifierCode')}</Label>
            <Input
              id='identifierCode'
              placeholder={t('form.identifierCodePlaceholder')}
              {...register('identifierCode')}
            />
          </div>
        </div>
      </div>

      <div className='grid gap-2 sm:gap-4 md:grid-cols-2'>
        <div className='border rounded-lg p-4 space-y-3 sm:space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='landingPage' className='text-sm'>{t('form.landingPage')}</Label>
            <Controller
              name='landingPage'
              control={control}
              render={({ field }) => (
                <SingleSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={landingPages || []}
                  labelKey='pageName'
                  valueKey='pageName'
                  placeholder={t('form.landingPagePlaceholder')}
                  searchPlaceholder='Search landing page...'
                />
              )}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='campaign' className='text-sm'>{t('form.campaign')}</Label>
            <Controller
              name='campaign'
              control={control}
              render={({ field }) => (
                <SingleSelect
                  value={field.value}
                  onValueChange={field.onChange}
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
                />
              )}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='country' className='text-sm'>{t('form.country')}</Label>
            <Controller
              name='country'
              control={control}
              render={({ field }) => (
                <SingleSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={countries || []}
                  labelKey='targetCountryName'
                  valueKey='targetCountryCode'
                  placeholder={t('form.countryPlaceholder')}
                  searchPlaceholder='Search country...'
                />
              )}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='language' className='text-sm'>{t('form.language')}</Label>
            <Controller
              name='language'
              control={control}
              render={({ field }) => (
                <SingleSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={languages || []}
                  labelKey='targetCountryName'
                  valueKey='targetCountryCode'
                  placeholder={
                    isLoadingLanguages
                      ? 'Loading languages...'
                      : !selectedCountry
                        ? 'Select a country first'
                        : t('form.languagePlaceholder')
                  }
                  searchPlaceholder='Search language...'
                  disabled={!selectedCountry || isLoadingLanguages}
                />
              )}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='domainName' className='text-sm'>{t('form.domainName')}</Label>
            <div className='flex flex-col sm:flex-row gap-2'>
              <div className='w-full sm:w-80 sm:flex-shrink-0'>
                <Controller
                  name='domainName'
                  control={control}
                  render={({ field }) => (
                    <SingleSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      options={[]}
                      labelKey='label'
                      valueKey='value'
                      placeholder={t('form.domainNamePlaceholder')}
                      searchPlaceholder='Search domain...'
                    />
                  )}
                />
              </div>
              <Input
                id='domainReservedNote'
                placeholder={t('form.domainReservedNotePlaceholder')}
                {...register('domainReservedNote')}
                className='flex-1'
                required
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='shortLinkName' className='text-sm'>{t('form.shortLinkName')}</Label>
            <div className='flex flex-col sm:flex-row gap-2'>
              <div className='w-full sm:w-80 sm:flex-shrink-0'>
                <Controller
                  name='shortLinkName'
                  control={control}
                  render={({ field }) => (
                    <SingleSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      options={[]}
                      labelKey='label'
                      valueKey='value'
                      placeholder={t('form.shortLinkNamePlaceholder')}
                      searchPlaceholder='Search short link...'
                    />
                  )}
                />
              </div>
              <div className='flex items-center gap-2 flex-1'>
                <span className='text-muted-foreground hidden sm:inline'>/</span>
                <Input
                  id='shortLinkValue'
                  placeholder={t('form.shortLinkValuePlaceholder')}
                  {...register('shortLinkValue')}
                  className='flex-1 min-w-0'
                />
              </div>
            </div>
          </div>
        </div>

        <div className='border rounded-lg p-4 space-y-3 sm:space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='event' className='text-sm'>{t('form.event')}</Label>
            <Controller
              name='event'
              control={control}
              render={({ field }) => (
                <MultipleSelect
                  value={Array.isArray(field.value) ? field.value : []}
                  onValueChange={field.onChange}
                  options={events || []}
                  labelKey='componentName'
                  valueKey='componentId'
                  placeholder={t('form.eventPlaceholder')}
                  searchPlaceholder='Search event...'
                  selectedDisplayPattern='{0} events selected'
                  onCreateNew={() => handleCreateNew('event')}
                />
              )}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='group' className='text-sm'>{t('form.group')}</Label>
            <Controller
              name='group'
              control={control}
              render={({ field }) => (
                <SingleSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={groups || []}
                  labelKey='componentName'
                  valueKey='componentId'
                  placeholder={t('form.groupPlaceholder')}
                  searchPlaceholder='Search group...'
                  onCreateNew={() => handleCreateNew('group')}
                />
              )}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='channel' className='text-sm'>{t('form.channel')}</Label>
            <Controller
              name='channel'
              control={control}
              render={({ field }) => (
                <SingleSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={channels || []}
                  labelKey='componentName'
                  valueKey='componentId'
                  placeholder={t('form.channelPlaceholder')}
                  searchPlaceholder='Search channel...'
                  onCreateNew={() => handleCreateNew('channel')}
                />
              )}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='agency' className='text-sm'>{t('form.agency')}</Label>
            <Controller
              name='agency'
              control={control}
              render={({ field }) => (
                <SingleSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={agencies || []}
                  labelKey='componentName'
                  valueKey='componentId'
                  placeholder={t('form.agencyPlaceholder')}
                  searchPlaceholder='Search agency...'
                  onCreateNew={() => handleCreateNew('agency')}
                />
              )}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='type' className='text-sm'>{t('form.type')}</Label>
            <Controller
              name='type'
              control={control}
              render={({ field }) => (
                <SingleSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={types || []}
                  labelKey='componentName'
                  valueKey='componentId'
                  placeholder={t('form.typePlaceholder')}
                  searchPlaceholder='Search type...'
                  onCreateNew={() => handleCreateNew('type')}
                />
              )}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='note' className='text-sm'>{t('form.note')}</Label>
            <Input
              id='note'
              placeholder={t('form.notePlaceholder')}
              {...register('note')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

