import { useEffect, useState } from 'react'
import { useWatch, type UseFormReturn } from 'react-hook-form'
import { useGetDomains, useGetLanguages, useRefreshDomains } from '../../api/queries'
import type { LandingPageOption } from '../../types'
import type { GenerateLinkFormValues } from '../../data/schema'

type UseCountryOptionsParams = {
  form: UseFormReturn<GenerateLinkFormValues>
  selectedLandingPage: LandingPageOption | null
}

export function useCountryOptions({
  form,
  selectedLandingPage,
}: UseCountryOptionsParams) {
  const selectedCountryCode = useWatch({ control: form.control, name: 'country' })
  const [refreshingType, setRefreshingType] = useState<number | null>(null)

  const { data: languages } = useGetLanguages(selectedCountryCode || '')

  const domainTypeFullLink = selectedLandingPage?.pageType === 3 ? 0 : 1
  const domainTypeShortLink = 2

  const { data: domains } = useGetDomains(
    selectedCountryCode || '',
    domainTypeFullLink
  )
  const { data: domainsForShortLink } = useGetDomains(
    selectedCountryCode || '',
    domainTypeShortLink
  )

  const { mutate: refreshDomainsMutation, isPending } = useRefreshDomains()

  const handleRefreshDomains = (domainType: number) => {
    if (!selectedCountryCode) return
    
    setRefreshingType(domainType)
    refreshDomainsMutation({ domainType, countryCode: selectedCountryCode }, {
      onSettled: () => {
        setTimeout(() => setRefreshingType(null), 1500)
      },
    })
  }

  useEffect(() => {
    if (languages && languages.length > 0 && selectedCountryCode) {
      const currentLanguage = form.getValues('language')
      const currentShortedLanguageCode = form.getValues('shortedLanguageCode')

      if (!currentLanguage || !currentShortedLanguageCode) {
        const firstLanguage = languages[0]
        if (firstLanguage) {
          form.setValue('language', firstLanguage.languageCode || '')
          form.setValue(
            'shortedLanguageCode',
            firstLanguage.targetLanguageCode || ''
          )
        }
      }
    }
  }, [languages, selectedCountryCode, form])

  useEffect(() => {
    if (domains && domains.length > 0) {
      const currentDomain = form.getValues('domainName')
      if (currentDomain) return
      const firstDomain = domains[0]
      if (firstDomain) {
        form.setValue('domainName', firstDomain.domainName)
      }
    }
  }, [domains, form])

  useEffect(() => {
    if (domainsForShortLink && domainsForShortLink.length > 0) {
      const currentShortDomain = form.getValues('shortDomain')
      if (currentShortDomain) return
      const firstShortDomain = domainsForShortLink[0]
      if (firstShortDomain) {
        form.setValue('shortDomain', firstShortDomain.domainName)
      }
    }
  }, [domainsForShortLink, form])

  return {
    languages,
    domains,
    domainsForShortLink,
    refreshDomains: handleRefreshDomains,
    isRefreshingRedirect: refreshingType === domainTypeFullLink && isPending,
    isRefreshingShortLink: refreshingType === domainTypeShortLink && isPending,
    domainTypeFullLink,
    domainTypeShortLink,
    canRefresh: !!selectedCountryCode,
  }
}

