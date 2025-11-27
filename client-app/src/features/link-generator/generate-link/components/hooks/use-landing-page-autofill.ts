import { useState, useEffect } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { LandingPageOption, TargetCountry } from '../../types'
import type { GenerateLinkFormValues } from '../../data/schema'

type UseLandingPageAutofillParams = {
  form: UseFormReturn<GenerateLinkFormValues>
  languages: TargetCountry[] | undefined
}

export function useLandingPageAutofill({
  form,
  languages,
}: UseLandingPageAutofillParams) {
  const [selectedLandingPage, setSelectedLandingPage] =
    useState<LandingPageOption | null>(null)

  useEffect(() => {
    if (selectedLandingPage && selectedLandingPage.marketId) {
      const language = languages?.find(
        (lang: TargetCountry) =>
          lang.languageCode === selectedLandingPage.marketId
      )
      if (language) {
        form.setValue('language', language.languageCode || '')
        form.setValue('shortedLanguageCode', language.targetLanguageCode || '')
      } else {
        form.setValue('language', '')
        form.setValue('shortedLanguageCode', '')
      }
    }
  }, [selectedLandingPage, languages, form])

  const handleLandingPageChange = (
    _value: string,
    option?: LandingPageOption | null
  ) => {
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

  return { selectedLandingPage, handleLandingPageChange }
}

