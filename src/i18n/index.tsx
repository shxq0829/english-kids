import React, { createContext, useContext, useState, useCallback } from 'react';
import { translations } from './translations';
import type { Lang } from './translations';

interface I18nContextType {
  lang: Lang;
  toggleLang: () => void;
  setLang: (l: Lang) => void;
  t: (path: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType>(null!);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() =>
    (localStorage.getItem('lang') as Lang) || 'zh'
  );

  const setLang = useCallback((l: Lang) => {
    localStorage.setItem('lang', l);
    setLangState(l);
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'en' ? 'zh' : 'en');
  }, [lang, setLang]);

  const t = useCallback(
    (path: string, vars?: Record<string, string | number>) => {
      const keys = path.split('.');
      let val: any = translations[lang];
      for (const k of keys) {
        if (val == null) break;
        val = val[k];
      }
      if (typeof val !== 'string') return path;
      if (vars) {
        return val.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`));
      }
      return val;
    },
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, toggleLang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
