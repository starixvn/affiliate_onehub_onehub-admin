import type { LinkGeneratorOptions } from '../types'

const countryLanguages: Record<string, { value: string; label: string }[]> = {
  us: [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
  ],
  uk: [
    { value: 'en', label: 'English' },
  ],
  ca: [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'French' },
  ],
  au: [
    { value: 'en', label: 'English' },
  ],
  de: [
    { value: 'de', label: 'German' },
    { value: 'en', label: 'English' },
  ],
  fr: [
    { value: 'fr', label: 'French' },
    { value: 'en', label: 'English' },
  ],
  jp: [
    { value: 'ja', label: 'Japanese' },
    { value: 'en', label: 'English' },
  ],
  cn: [
    { value: 'zh', label: 'Chinese' },
    { value: 'en', label: 'English' },
  ],
}

export const getLanguagesByCountry = (countryCode: string): Promise<{ value: string; label: string }[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(countryLanguages[countryCode] || [])
    }, 500)
  })
}

export const mockLinkGeneratorOptions: LinkGeneratorOptions = {
  campaigns: [
    { value: '1', label: 'Summer Campaign 2024' },
    { value: '2', label: 'Winter Promotion' },
    { value: '3', label: 'Spring Launch' },
    { value: '4', label: 'Holiday Special' },
  ],
  countries: [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'jp', label: 'Japan' },
    { value: 'cn', label: 'China' },
  ],
  languages: [
    { value: 'en', label: 'English' },
    { value: 'zh', label: 'Chinese' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'ja', label: 'Japanese' },
  ],
  groups: [
    { value: '1', label: 'VIP Group' },
    { value: '2', label: 'Regular Group' },
    { value: '3', label: 'Premium Group' },
    { value: '4', label: 'Standard Group' },
  ],
  events: [
    { value: '1', label: 'Black Friday' },
    { value: '2', label: 'Cyber Monday' },
    { value: '3', label: 'New Year Sale' },
    { value: '4', label: 'Summer Sale' },
  ],
  channels: [
    { value: 'email', label: 'Email' },
    { value: 'social', label: 'Social Media' },
    { value: 'search', label: 'Search Engine' },
    { value: 'display', label: 'Display Ads' },
    { value: 'affiliate', label: 'Affiliate' },
  ],
  types: [
    { value: 'cpc', label: 'Cost Per Click' },
    { value: 'cpa', label: 'Cost Per Action' },
    { value: 'cpm', label: 'Cost Per Mille' },
    { value: 'cpl', label: 'Cost Per Lead' },
  ],
  agencies: [
    { value: '1', label: 'Agency A' },
    { value: '2', label: 'Agency B' },
    { value: '3', label: 'Agency C' },
    { value: '4', label: 'In-House' },
  ],
  landingPages: [
    { value: '1', label: 'Homepage' },
    { value: '2', label: 'Product Page' },
    { value: '3', label: 'Signup Page' },
    { value: '4', label: 'Promotion Page' },
  ],
  domainNames: [
    { value: '1', label: 'BRTMXN.com' },
    { value: '2', label: 'SN7TCKS.com' },
    { value: '3', label: 'JRMatter.com' },
    { value: '4', label: 'Checkoo.com' },
  ],
  shortLinkNames: [
    { value: '1', label: 'Short Link 1' },
    { value: '2', label: 'Short Link 2' },
    { value: '3', label: 'Short Link 3' },
  ],
}

