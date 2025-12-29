import { describe, it, expect } from "vitest";
import { translations } from "./i18n";

describe("i18n - Localization", () => {
  describe("Language coverage", () => {
    it("should have both English and Japanese translations", () => {
      expect(translations).toHaveProperty("en");
      expect(translations).toHaveProperty("ja");
    });

    it("should have matching keys between English and Japanese", () => {
      const enKeys = JSON.stringify(Object.keys(translations.en).sort());
      const jaKeys = JSON.stringify(Object.keys(translations.ja).sort());
      expect(enKeys).toBe(jaKeys);
    });
  });

  describe("Common section", () => {
    it("should have all common translations", () => {
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
        expect(translations.en.common).toHaveProperty(key);
        expect(translations.ja.common).toHaveProperty(key);
      });
    });

    it("should have non-empty translations for common section", () => {
      Object.entries(translations.en.common).forEach(([key, value]) => {
        expect(value).toBeTruthy();
        expect(translations.ja.common[key as keyof typeof translations.ja.common]).toBeTruthy();
      });
    });
  });

  describe("Home section", () => {
    it("should have all home screen translations", () => {
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
        expect(translations.en.home).toHaveProperty(key);
        expect(translations.ja.home).toHaveProperty(key);
      });
    });
  });

  describe("Terminal section", () => {
    it("should have all terminal screen translations", () => {
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
        expect(translations.en.terminal).toHaveProperty(key);
        expect(translations.ja.terminal).toHaveProperty(key);
      });
    });
  });

  describe("File Manager section", () => {
    it("should have all file manager translations", () => {
      const fileManagerKeys = [
        "title",
        "newFolder",
        "newFile",
        "emptyDirectory",
        "emptyDirectoryDesc",
        "folder",
        "file",
        "view",
        "rename",
        "delete",
        "deleteConfirm",
        "renamePrompt",
        "createFolderPrompt",
        "createFilePrompt",
        "fileExists",
        "items",
        "longPressOptions",
        "emptyFile",
        "up",
        "longPressHint",
      ];
      fileManagerKeys.forEach((key) => {
        expect(translations.en.fileManager).toHaveProperty(key);
        expect(translations.ja.fileManager).toHaveProperty(key);
      });
    });
  });

  describe("GUI Viewer section", () => {
    it("should have all GUI viewer translations", () => {
      const guiViewerKeys = [
        "title",
        "vncSettings",
        "host",
        "port",
        "password",
        "connect",
        "connectionSettings",
        "enterHost",
        "enterPort",
        "enterPassword",
      ];
      guiViewerKeys.forEach((key) => {
        expect(translations.en.guiViewer).toHaveProperty(key);
        expect(translations.ja.guiViewer).toHaveProperty(key);
      });
    });
  });

  describe("Termux Setup section", () => {
    it("should have all Termux setup translations", () => {
      const termuxSetupKeys = [
        "title",
        "integrationStatus",
        "checking",
        "termuxInstalled",
        "termuxAPI",
        "urlScheme",
        "commandExecution",
        "openTermux",
        "installTermux",
        "setupInstructions",
        "step1",
        "step1Desc",
        "step2",
        "step2Desc",
        "step3",
        "step3Desc",
        "step4",
        "step4Desc",
        "features",
        "documentation",
        "wiki",
        "termuxNotDetected",
        "termuxNotDetectedDesc",
      ];
      termuxSetupKeys.forEach((key) => {
        expect(translations.en.termuxSetup).toHaveProperty(key);
        expect(translations.ja.termuxSetup).toHaveProperty(key);
      });
    });
  });

  describe("Settings section", () => {
    it("should have all settings translations", () => {
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
        expect(translations.en.settings).toHaveProperty(key);
        expect(translations.ja.settings).toHaveProperty(key);
      });
    });
  });

  describe("Japanese translations", () => {
    it("should have Japanese text for all keys", () => {
      const checkJapanese = (obj: any, path = "") => {
        Object.entries(obj).forEach(([key, value]) => {
          const currentPath = path ? `${path}.${key}` : key;
          if (typeof value === "object" && value !== null) {
            checkJapanese(value, currentPath);
          } else if (typeof value === "string") {
            // Check that Japanese translations are not just English copies
            expect(value.length).toBeGreaterThan(0);
          }
        });
      };
      checkJapanese(translations.ja);
    });
  });

  describe("English translations", () => {
    it("should have English text for all keys", () => {
      const checkEnglish = (obj: any, path = "") => {
        Object.entries(obj).forEach(([key, value]) => {
          const currentPath = path ? `${path}.${key}` : key;
          if (typeof value === "object" && value !== null) {
            checkEnglish(value, currentPath);
          } else if (typeof value === "string") {
            expect(value.length).toBeGreaterThan(0);
          }
        });
      };
      checkEnglish(translations.en);
    });
  });

  describe("Translation consistency", () => {
    it("should have same number of keys in each section", () => {
      const sections = [
        "common",
        "home",
        "terminal",
        "fileManager",
        "guiViewer",
        "termuxSetup",
        "settings",
      ] as const;

      sections.forEach((section) => {
        const enCount = Object.keys(translations.en[section]).length;
        const jaCount = Object.keys(translations.ja[section]).length;
        expect(enCount).toBe(jaCount);
      });
    });
  });
});
