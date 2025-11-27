import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { statuses } from '../../data/link'
import { useGetCountries, useGetChannels } from '../../api/queries'

export const useLinkFilters = () => {
  const { t } = useTranslation('link-management')
  const { data: countries } = useGetCountries()
  const { data: channels } = useGetChannels()

  const filters = useMemo(
    () => [
      {
        columnId: 'filter_country',
        title: t('filters.country'),
        options: (countries || []).map((country) => ({
          label: country.targetCountryName,
          value: country.targetCountryCode,
        })),
        defaultValue: [],
      },
      {
        columnId: 'filter_channel',
        title: t('filters.channel'),
        options: (channels || []).map((channel) => ({
          label: channel.componentName,
          value: String(channel.componentId),
        })),
        defaultValue: [],
      },
      {
        columnId: 'filter_status',
        title: t('filters.status'),
        options: statuses.map(({ label, value }) => ({
          label,
          value,
        })),
        defaultValue: ['1'],
      },
    ],
    [t, countries, channels]
  )

  return filters
}
