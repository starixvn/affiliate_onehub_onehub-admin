import { Controller, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SingleSelect, MultipleSelect } from '@/components/dropdowns'
import { useGenerateLink, type DialogType } from './generate-link-provider'
import { useGetDomains } from '../api/queries'
import type { CampaignInfo, LandingPageOption } from '../types'

export function GenerateLinkForm() {
  const { t } = useTranslation('link-generator')
  const { form, campaigns, countries, languages, events, groups, channels, agencies, types, landingPages, setDialogOpen } = useGenerateLink()
  const { register, control } = form

  const selectedCountryCode = useWatch({ control, name: 'country' })
  const selectedLandingPageCode = useWatch({ control, name: 'landingPage' })

  const selectedLandingPage = landingPages && selectedLandingPageCode
    ? Object.values(landingPages).flat().find((lp) => lp.pageCode === selectedLandingPageCode)
    : null

  const domainTypePrimary = selectedLandingPage?.pageType === 3 ? 0 : 1
  const domainTypeShortLink = 2

  const { data: domains } = useGetDomains(selectedCountryCode || '', domainTypePrimary)
  const { data: domainsForShortLink } = useGetDomains(selectedCountryCode || '', domainTypeShortLink)

  const handleCreateNew = (type: DialogType) => {
    setDialogOpen(type)
  }

  const handleLandingPageChange = (option: LandingPageOption | null) => {
    if (option) {
      if (option.campaignId) {
        form.setValue('campaign', String(option.campaignId))
      }
      if (option.targetCountryCode) {
        form.setValue('country', String(option.targetCountryCode))
      }
      if (option.marketId) {
        form.setValue('language', String(option.marketId))
      }
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
                <SingleSelect<LandingPageOption>
                  value={field.value}
                  onValueChange={field.onChange}
                  options={landingPages || {}}
                  labelKey='pageName'
                  valueKey='pageCode'
                  placeholder={t('form.landingPagePlaceholder')}
                  searchPlaceholder='Search landing page...'
                  onSelectedOptionChange={handleLandingPageChange}
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
                  labelKey='displayName'
                  valueKey='marketId'
                  placeholder={t('form.languagePlaceholder')}
                  searchPlaceholder='Search language...'
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
                      options={domains || []}
                      labelKey='domainName'
                      valueKey='domainName'
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
            <div className='flex flex-col sm:flex-row gap-1'>
              <div className='w-full sm:w-80 sm:flex-shrink-0'>
                <Controller
                  name='shortLinkName'
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
                    />
                  )}
                />
              </div>
              <div className='flex items-center gap-1 flex-1'>
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

