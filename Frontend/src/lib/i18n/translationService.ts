// src/lib/i18n/index.ts
import en from './en'
import ar from './ar'
import fr from './fr'
import { localStorageManager } from '@/lib/localStorageManager'

const translations = {
  en,
  ar,
  fr,
  // Add other languages here
}

let currentLang: keyof typeof translations =
  (localStorageManager.getSessionLanguage() as keyof typeof translations) || 'en' 

if (!localStorageManager.getSessionLanguage()) {
  localStorageManager.setSessionLanguage('en')
}

export function t(key: keyof typeof en): string {
  return translations[currentLang][key] || key
}

export function setLang(lang: keyof typeof translations) {
  currentLang = lang
  localStorageManager.setSessionLanguage(lang)
}
