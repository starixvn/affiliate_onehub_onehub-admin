import enCampaignManagement from '@/locales/en/campaign-management.json'
import enCommon from '@/locales/en/common.json'
import zhCampaignManagement from '@/locales/zh/campaign-management.json'
import zhCommon from '@/locales/zh/common.json'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    common: enCommon,
    'campaign-management': enCampaignManagement,
  },
  zh: {
    common: zhCommon,
    'campaign-management': zhCampaignManagement,
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'campaign-management'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['cookie', 'navigator'],
      caches: ['cookie'],
      cookieMinutes: 525600,
    },
  })

export default i18n
