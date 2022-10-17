import i18next from 'i18next';
import RNLocalize from 'react-native-localize';
import { initReactI18next } from 'react-i18next';

import pt from './translations/pt.json';
import en from './translations/en.json';
import es from './translations/es.json';

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',

  lng: RNLocalize.findBestAvailableLanguage(['pt', 'en', 'es'])?.languageTag,
  fallbackLng: 'pt',

  ns: ['translation'],
  defaultNS: 'translation',

  resources: { en, pt, es },

  react: { useSuspense: false },
  interpolation: { escapeValue: false },
});

export default i18next;
