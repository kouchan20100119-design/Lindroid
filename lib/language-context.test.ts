import { describe, it, expect, vi, beforeEach } from "vitest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getTranslations, translations } from "./i18n";

// Mock AsyncStorage
vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

describe("Localization (i18n)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Translation Keys", () => {
    it("should have all required translation keys for English", () => {
      const en = translations.en;
      expect(en.common).toBeDefined();
      expect(en.home).toBeDefined();
      expect(en.terminal).toBeDefined();
      expect(en.fileManager).toBeDefined();
      expect(en.guiViewer).toBeDefined();
      expect(en.termuxSetup).toBeDefined();
      expect(en.settings).toBeDefined();
    });

    it("should have all required translation keys for Japanese", () => {
      const ja = translations.ja;
      expect(ja.common).toBeDefined();
      expect(ja.home).toBeDefined();
      expect(ja.terminal).toBeDefined();
      expect(ja.fileManager).toBeDefined();
      expect(ja.guiViewer).toBeDefined();
      expect(ja.termuxSetup).toBeDefined();
      expect(ja.settings).toBeDefined();
    });

    it("should have matching keys between English and Japanese", () => {
      const enKeys = Object.keys(translations.en);
      const jaKeys = Object.keys(translations.ja);
      expect(enKeys).toEqual(jaKeys);
    });
  });

  describe("Common Translations", () => {
    it("should have all common keys in both languages", () => {
      const commonKeys = [
        "save",
        "cancel",
        "delete",
        "back",
        "settings",
        "home",
        "error",
        "success",
        "loading",
      ];

      commonKeys.forEach((key) => {
        expect(translations.en.common[key as keyof typeof translations.en.common]).toBeDefined();
        expect(translations.ja.common[key as keyof typeof translations.ja.common]).toBeDefined();
      });
    });

    it("should have different translations for English and Japanese", () => {
      expect(translations.en.common.save).not.toBe(translations.ja.common.save);
      expect(translations.en.common.cancel).not.toBe(translations.ja.common.cancel);
      expect(translations.en.common.delete).not.toBe(translations.ja.common.delete);
    });
  });

  describe("Home Translations", () => {
    it("should have all home screen keys", () => {
      const homeKeys = [
        "title",
        "subtitle",
        "newTerminal",
        "newTerminalDesc",
        "guiViewer",
        "guiViewerDesc",
        "fileManager",
        "fileManagerDesc",
        "termuxIntegration",
        "termuxIntegrationDesc",
        "savedSessions",
        "noSessions",
        "noSessionsDesc",
      ];

      homeKeys.forEach((key) => {
        expect(translations.en.home[key as keyof typeof translations.en.home]).toBeDefined();
        expect(translations.ja.home[key as keyof typeof translations.ja.home]).toBeDefined();
      });
    });
  });

  describe("Terminal Translations", () => {
    it("should have all terminal screen keys", () => {
      const terminalKeys = [
        "title",
        "termuxMode",
        "termuxModeDesc",
        "termuxNotInstalled",
        "simulationMode",
        "welcome",
        "welcomeDesc",
        "termuxDetected",
        "termuxNotDetected",
        "enterCommand",
        "history",
        "sessionSaved",
        "sessionSaveError",
      ];

      terminalKeys.forEach((key) => {
        expect(translations.en.terminal[key as keyof typeof translations.en.terminal]).toBeDefined();
        expect(translations.ja.terminal[key as keyof typeof translations.ja.terminal]).toBeDefined();
      });
    });
  });

  describe("Settings Translations", () => {
    it("should have all settings screen keys", () => {
      const settingsKeys = [
        "title",
        "general",
        "theme",
        "language",
        "terminal",
        "fontSize",
        "colorScheme",
        "about",
        "version",
        "description",
        "features",
        "note",
        "noteDesc",
        "light",
        "dark",
        "system",
        "small",
        "medium",
        "large",
        "extraLarge",
        "default",
        "blue",
        "amber",
        "japanese",
        "english",
      ];

      settingsKeys.forEach((key) => {
        expect(translations.en.settings[key as keyof typeof translations.en.settings]).toBeDefined();
        expect(translations.ja.settings[key as keyof typeof translations.ja.settings]).toBeDefined();
      });
    });

    it("should have language options in settings", () => {
      expect(translations.en.settings.japanese).toBe("日本語");
      expect(translations.en.settings.english).toBe("English");
      expect(translations.ja.settings.japanese).toBe("日本語");
      expect(translations.ja.settings.english).toBe("English");
    });
  });

  describe("getTranslations Function", () => {
    it("should return English translations", () => {
      const en = getTranslations("en");
      expect(en.common.save).toBe("Save");
      expect(en.home.title).toBe("Lindroid");
    });

    it("should return Japanese translations", () => {
      const ja = getTranslations("ja");
      expect(ja.common.save).toBe("保存");
      expect(ja.home.title).toBe("Lindroid");
    });
  });

  describe("Translation Content Quality", () => {
    it("should not have empty translation strings", () => {
      const checkEmpty = (obj: any) => {
        Object.values(obj).forEach((value) => {
          if (typeof value === "string") {
            expect(value.length).toBeGreaterThan(0);
          } else if (typeof value === "object" && value !== null) {
            checkEmpty(value);
          }
        });
      };

      checkEmpty(translations.en);
      checkEmpty(translations.ja);
    });

    it("should have consistent formatting in translations", () => {
      // Check that common UI patterns are consistent
      expect(translations.en.settings.small).toMatch(/Small/);
      expect(translations.en.settings.medium).toMatch(/Medium/);
      expect(translations.en.settings.large).toMatch(/Large/);
      expect(translations.en.settings.extraLarge).toMatch(/Extra Large/);
    });
  });

  describe("Language-Specific Content", () => {
    it("should have proper Japanese characters in Japanese translations", () => {
      const jaContent = JSON.stringify(translations.ja);
      // Check for common Japanese characters
      expect(jaContent).toMatch(/[\u3040-\u309F]/); // Hiragana
      expect(jaContent).toMatch(/[\u30A0-\u30FF]/); // Katakana
      expect(jaContent).toMatch(/[\u4E00-\u9FFF]/); // Kanji
    });

    it("should have proper English content in English translations", () => {
      const enContent = JSON.stringify(translations.en);
      // Check for English words
      expect(enContent).toMatch(/Home/);
      expect(enContent).toMatch(/Settings/);
      expect(enContent).toMatch(/Terminal/);
    });
  });

  describe("Edge Cases", () => {
    it("should handle special characters in translations", () => {
      const en = getTranslations("en");
      // Check for translations with special characters
      expect(en.termuxSetup.step2Desc).toContain("&&");
      expect(en.fileManager.deleteConfirm).toBeDefined();
    });

    it("should handle multi-line translations", () => {
      const en = getTranslations("en");
      // Some translations might contain newlines
      expect(typeof en.settings.description).toBe("string");
      expect(en.settings.description.length).toBeGreaterThan(10);
    });
  });
});
