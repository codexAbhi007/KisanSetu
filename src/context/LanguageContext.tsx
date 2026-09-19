import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  TRANSLATIONS,
  LanguageOption,
} from "../config/translations";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  availableLanguages: LanguageOption[];
  t: (key: any, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(
        "kisansetu_app_language",
      ) as SupportedLanguage;
      if (saved && TRANSLATIONS[saved]) return saved;
    } catch {
      // Storage unavailable
    }
    return "en";
  });

  const setLanguage = (targetLang: SupportedLanguage) => {
    if (!targetLang || !TRANSLATIONS[targetLang]) return;
    setLanguageState(targetLang);
    try {
      localStorage.setItem("kisansetu_app_language", targetLang);
      document.documentElement.lang = targetLang;
    } catch {
      // Ignore storage errors
    }
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {
      // Ignore
    }
  }, [language]);

  const t = (key: any, fallback?: string): string => {
    if (key === undefined || key === null) return fallback || "";
    if (typeof key !== "string") return String(key);
    if (!key.trim()) return "";

    const currentLang = language || "en";
    const langDict = TRANSLATIONS[currentLang] || TRANSLATIONS.en || {};

    // 1. Exact match in active dictionary
    if (langDict[key]) {
      return langDict[key];
    }

    // 2. Snake case lookup
    const snakeCaseKey = key
      .toLowerCase()
      .trim()
      .replace(/[\s-&]+/g, "_");
    if (langDict[snakeCaseKey]) {
      return langDict[snakeCaseKey];
    }

    // 3. Fallback or English original
    const enDict = TRANSLATIONS.en || {};
    return enDict[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        availableLanguages: SUPPORTED_LANGUAGES,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: "en",
      setLanguage: () => {},
      availableLanguages: SUPPORTED_LANGUAGES,
      t: (k: any, fb?: string) => (typeof k === "string" ? k : fb || ""),
    };
  }
  return context;
};
