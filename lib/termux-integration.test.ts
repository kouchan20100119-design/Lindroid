import { describe, it, expect, beforeEach, vi } from "vitest";
import { Platform, Linking } from "react-native";

// Mock React Native modules
vi.mock("react-native", () => ({
  Platform: {
    OS: "android",
  },
  Linking: {
    canOpenURL: vi.fn(),
    openURL: vi.fn(),
  },
  Alert: {
    alert: vi.fn(),
  },
}));

// Mock expo-file-system
vi.mock("expo-file-system", () => ({
  getInfoAsync: vi.fn(),
}));

// Import after mocking
import {
  isTermuxInstalled,
  openTermux,
  executeTermuxCommand,
  getTermuxHomePath,
  getTermuxSharedStoragePath,
  getTermuxStatus,
  getTermuxDetectionDebugInfo,
  isTermuxAPIInstalled,
} from "./termux-integration";
import * as FileSystem from "expo-file-system";

describe("Termux Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("isTermuxInstalled", () => {
    it("should return true when Termux is installed via URL scheme", async () => {
      vi.mocked(Linking.canOpenURL).mockResolvedValue(true);
      vi.mocked(FileSystem.getInfoAsync).mockResolvedValue({
        exists: false,
        isDirectory: false,
      } as any);

      const result = await isTermuxInstalled();
      expect(result).toBe(true);
    });

    it("should return true when Termux is installed via file system", async () => {
      vi.mocked(Linking.canOpenURL).mockResolvedValue(false);
      vi.mocked(FileSystem.getInfoAsync).mockResolvedValue({
        exists: true,
        isDirectory: true,
      } as any);

      const result = await isTermuxInstalled();
      expect(result).toBe(true);
    });

    it("should return false when Termux is not installed", async () => {
      vi.mocked(Linking.canOpenURL).mockResolvedValue(false);
      vi.mocked(FileSystem.getInfoAsync).mockResolvedValue({
        exists: false,
        isDirectory: false,
      } as any);

      const result = await isTermuxInstalled();
      expect(result).toBe(false);
    });

    it("should return false on non-Android platforms", async () => {
      const originalOS = Platform.OS;
      (Platform as any).OS = "ios";

      const result = await isTermuxInstalled();
      expect(result).toBe(false);

      (Platform as any).OS = originalOS;
    });
  });

  describe("openTermux", () => {
    it("should open Termux when installed", async () => {
      vi.mocked(Linking.canOpenURL).mockResolvedValue(true);
      const result = await openTermux();
      expect(result).toBe(true);
      expect(Linking.openURL).toHaveBeenCalledWith("termux://");
    });

    it("should return false when Termux is not installed", async () => {
      vi.mocked(Linking.canOpenURL).mockResolvedValue(false);
      const result = await openTermux();
      expect(result).toBe(false);
      expect(Linking.openURL).not.toHaveBeenCalled();
    });

    it("should handle errors gracefully", async () => {
      vi.mocked(Linking.canOpenURL).mockRejectedValue(new Error("Test error"));
      const result = await openTermux();
      expect(result).toBe(false);
    });
  });

  describe("executeTermuxCommand", () => {
    it("should execute command when Termux is installed", async () => {
      vi.mocked(Linking.canOpenURL).mockResolvedValue(true);
      vi.mocked(FileSystem.getInfoAsync).mockResolvedValue({
        exists: false,
        isDirectory: false,
      } as any);

      const result = await executeTermuxCommand("ls", ["-la"]);
      expect(result.success).toBe(true);
    });

    it("should return error when Termux is not installed", async () => {
      vi.mocked(Linking.canOpenURL).mockResolvedValue(false);
      vi.mocked(FileSystem.getInfoAsync).mockResolvedValue({
        exists: false,
        isDirectory: false,
      } as any);

      const result = await executeTermuxCommand("ls", ["-la"]);
      expect(result.success).toBe(false);
      expect(result.error).toContain("not installed");
    });

    it("should handle command with multiple arguments", async () => {
      vi.mocked(Linking.canOpenURL).mockResolvedValue(true);
      vi.mocked(FileSystem.getInfoAsync).mockResolvedValue({
        exists: false,
        isDirectory: false,
      } as any);

      const result = await executeTermuxCommand("echo", ["hello", "world"]);
      expect(result.success).toBe(true);
    });
  });

  describe("getTermuxDetectionDebugInfo", () => {
    it("should return debug information", async () => {
      vi.mocked(Linking.canOpenURL).mockResolvedValue(true);
      vi.mocked(FileSystem.getInfoAsync).mockResolvedValue({
        exists: true,
        isDirectory: true,
      } as any);

      const debugInfo = await getTermuxDetectionDebugInfo();

      expect(debugInfo).toHaveProperty("urlSchemeCheck");
      expect(debugInfo).toHaveProperty("fileSystemCheck");
      expect(debugInfo).toHaveProperty("packageManagerCheck");
      expect(debugInfo).toHaveProperty("timestamp");
    });

    it("should include error information when detection fails", async () => {
      vi.mocked(Linking.canOpenURL).mockRejectedValue(new Error("URL scheme error"));
      vi.mocked(FileSystem.getInfoAsync).mockRejectedValue(new Error("File system error"));

      const debugInfo = await getTermuxDetectionDebugInfo();

      expect(debugInfo.urlSchemeError).toBeDefined();
      expect(debugInfo.fileSystemError).toBeDefined();
    });
  });

  describe("getTermuxStatus", () => {
    it("should return Termux status", async () => {
      vi.mocked(Linking.canOpenURL).mockResolvedValue(true);
      vi.mocked(FileSystem.getInfoAsync).mockResolvedValue({
        exists: true,
        isDirectory: true,
      } as any);

      const status = await getTermuxStatus();

      expect(status).toHaveProperty("installed");
      expect(status).toHaveProperty("apiInstalled");
      expect(status).toHaveProperty("capabilities");
      expect(status).toHaveProperty("debugInfo");
    });

    it("should include capabilities information", async () => {
      vi.mocked(Linking.canOpenURL).mockResolvedValue(true);
      vi.mocked(FileSystem.getInfoAsync).mockResolvedValue({
        exists: true,
        isDirectory: true,
      } as any);

      const status = await getTermuxStatus();

      expect(status.capabilities).toHaveProperty("urlScheme");
      expect(status.capabilities).toHaveProperty("fileAccess");
      expect(status.capabilities).toHaveProperty("commandExecution");
    });
  });

  describe("isTermuxAPIInstalled", () => {
    it("should return true when Termux:API is installed", async () => {
      vi.mocked(Linking.canOpenURL).mockResolvedValue(true);
      vi.mocked(FileSystem.getInfoAsync).mockResolvedValue({
        exists: false,
        isDirectory: false,
      } as any);

      const result = await isTermuxAPIInstalled();
      expect(result).toBe(true);
    });

    it("should return false when Termux is not installed", async () => {
      vi.mocked(Linking.canOpenURL).mockResolvedValue(false);
      vi.mocked(FileSystem.getInfoAsync).mockResolvedValue({
        exists: false,
        isDirectory: false,
      } as any);

      const result = await isTermuxAPIInstalled();
      expect(result).toBe(false);
    });

    it("should return false on non-Android platforms", async () => {
      const originalOS = Platform.OS;
      (Platform as any).OS = "ios";

      const result = await isTermuxAPIInstalled();
      expect(result).toBe(false);

      (Platform as any).OS = originalOS;
    });
  });

  describe("Path functions", () => {
    it("should return correct Termux home path", () => {
      const path = getTermuxHomePath();
      expect(path).toBe("/data/data/com.termux/files/home");
    });

    it("should return correct Termux shared storage path", () => {
      const path = getTermuxSharedStoragePath();
      expect(path).toBe("/data/data/com.termux/files/home/storage/shared");
    });
  });

  describe("Multiple detection methods", () => {
    it("should use URL scheme when available", async () => {
      vi.mocked(Linking.canOpenURL).mockResolvedValue(true);
      vi.mocked(FileSystem.getInfoAsync).mockResolvedValue({
        exists: false,
        isDirectory: false,
      } as any);

      const result = await isTermuxInstalled();
      expect(result).toBe(true);
    });

    it("should use file system when URL scheme fails", async () => {
      vi.mocked(Linking.canOpenURL).mockResolvedValue(false);
      vi.mocked(FileSystem.getInfoAsync).mockResolvedValue({
        exists: true,
        isDirectory: true,
      } as any);

      const result = await isTermuxInstalled();
      expect(result).toBe(true);
    });

    it("should use package manager when other methods fail", async () => {
      vi.mocked(Linking.canOpenURL).mockImplementation(async (url: string) => {
        if (url === "termux://") return false;
        if (url === "termux://open?url=https://termux.dev") return true;
        return false;
      });
      vi.mocked(FileSystem.getInfoAsync).mockResolvedValue({
        exists: false,
        isDirectory: false,
      } as any);

      const result = await isTermuxInstalled();
      expect(result).toBe(true);
    });
  });
});
