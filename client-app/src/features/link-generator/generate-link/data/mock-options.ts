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

