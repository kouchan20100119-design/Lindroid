import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Language, getTranslations, Translations } from "./i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => Promise<void>;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = "lindroid_language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved language on mount
  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved && (saved === "en" || saved === "ja")) {
        setLanguageState(saved);
      }
    } catch (error) {
      console.error("Failed to load language preference:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  const setLanguage = async (newLanguage: Language) => {
    try {
      setLanguageState(newLanguage);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
    } catch (error) {
      console.error("Failed to save language preference:", error);
    }
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: getTranslations(language),
  };

  if (!isLoaded) {
    return null; // Don't render until language is loaded
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
