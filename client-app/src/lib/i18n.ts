
import enCommon from '@/locales/en/common.json'
import enCampaignManagement from '@/locales/en/campaign-management.json'
import enComponentManagement from '@/locales/en/component-management.json'
import enLinkGenerator from '@/locales/en/link-generator.json'
import enAssetUploader from '@/locales/en/asset-uploader.json'
import enRegistrationFormManagement from '@/locales/en/registration-form-management.json'


import zhCommon from '@/locales/zh/common.json'
import zhCampaignManagement from '@/locales/zh/campaign-management.json'
import zhComponentManagement from '@/locales/zh/component-management.json'
import zhLinkGenerator from '@/locales/zh/link-generator.json'
import zhAssetUploader from '@/locales/zh/asset-uploader.json'
import zhRegistrationFormManagement from '@/locales/zh/registration-form-management.json'

import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    common: enCommon,
    'campaign-management': enCampaignManagement,
    'component-management': enComponentManagement,
    'link-generator': enLinkGenerator,
    'asset-uploader': enAssetUploader,
    'registration-form-management': enRegistrationFormManagement,
  },
  zh: {
    common: zhCommon,
    'campaign-management': zhCampaignManagement,
    'component-management': zhComponentManagement,
    'link-generator': zhLinkGenerator,
    'asset-uploader': zhAssetUploader,
    'registration-form-management': zhRegistrationFormManagement,
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: [
      'common',
      'campaign-management',
      'component-management',
      'link-generator',
      'asset-uploader',
      'registration-form-management',
    ],
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
