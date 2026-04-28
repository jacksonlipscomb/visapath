import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enCommon from './locales/en/common.json'
import svCommon from './locales/sv/common.json'
import enRoutes from './locales/en/routes.json'
import svRoutes from './locales/sv/routes.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon, routes: enRoutes },
      sv: { common: svCommon, routes: svRoutes },
    },
    fallbackLng: 'en',
    defaultNS: 'common',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'visapath_lang',
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
