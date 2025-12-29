import { describe, it, expect, vi, beforeEach } from "vitest";
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

// Import after mocking
import {
  isTermuxInstalled,
  openTermux,
  executeTermuxCommand,
  getTermuxHomePath,
  getTermuxSharedStoragePath,
  getTermuxStatus,
} from "./termux-integration";

describe("Termux Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("isTermuxInstalled", () => {
    it("should return true when Termux is installed", async () => {
      vi.mocked(Linking.canOpenURL).mockResolvedValue(true);
      const result = await isTermuxInstalled();
      expect(result).toBe(true);
      expect(Linking.canOpenURL).toHaveBeenCalledWith("termux://");
    });

    it("should return false when Termux is not installed", async () => {
      vi.mocked(Linking.canOpenURL).mockResolvedValue(false);
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

    it("should handle errors gracefully", async () => {
      vi.mocked(Linking.canOpenURL).mockRejectedValue(new Error("Test error"));
      const result = await isTermuxInstalled();
      expect(result).toBe(false);
    });
  });

  describe("openTermux", () => {
    it("should open Termux when installed", async () => {
      vi.mocked(Linking.canOpenURL).mockResolvedValue(true);
      vi.mocked(Linking.openURL).mockResolvedValue(true);
      
      const result = await openTermux();
      expect(result).toBe(true);
      expect(Linking.openURL).toHaveBeenCalledWith("termux://");
    });

    it("should return false when Termux is not installed", async () => {
      vi.mocked(Linking.canOpenURL).mockResolvedValue(false);
      
      const result = await openTermux();
      expect(result).toBe(false);
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
      vi.mocked(Linking.openURL).mockResolvedValue(true);
      
      const result = await executeTermuxCommand("ls", ["-la"]);
      expect(result.success).toBe(true);
      expect(result.output).toBe("Command sent to Termux");
    });

    it("should return error when Termux is not installed", async () => {
      vi.mocked(Linking.canOpenURL).mockResolvedValue(false);
      
      const result = await executeTermuxCommand("ls");
      expect(result.success).toBe(false);
      expect(result.error).toContain("Termux is not installed");
    });

    it("should handle command with arguments", async () => {
      vi.mocked(Linking.canOpenURL).mockResolvedValue(true);
      vi.mocked(Linking.openURL).mockResolvedValue(true);
      
      const result = await executeTermuxCommand("echo", ["Hello", "World"]);
      expect(result.success).toBe(true);
    });

    it("should handle errors during execution", async () => {
      vi.mocked(Linking.canOpenURL).mockResolvedValue(true);
      vi.mocked(Linking.openURL).mockRejectedValue(new Error("Cannot open URL"));
      
      const result = await executeTermuxCommand("ls");
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("Path Helpers", () => {
    it("should return correct Termux home path", () => {
      const path = getTermuxHomePath();
      expect(path).toBe("/data/data/com.termux/files/home");
    });

    it("should return correct Termux shared storage path", () => {
      const path = getTermuxSharedStoragePath();
      expect(path).toBe("/data/data/com.termux/files/home/storage/shared");
    });
  });

  describe("getTermuxStatus", () => {
    it("should return complete status when Termux is installed", async () => {
      vi.mocked(Linking.canOpenURL).mockResolvedValue(true);
      
      const status = await getTermuxStatus();
      expect(status.installed).toBe(true);
      expect(status.capabilities.urlScheme).toBe(true);
      expect(status.capabilities.commandExecution).toBe(true);
    });

    it("should return negative status when Termux is not installed", async () => {
      vi.mocked(Linking.canOpenURL).mockResolvedValue(false);
      
      const status = await getTermuxStatus();
      expect(status.installed).toBe(false);
      expect(status.capabilities.urlScheme).toBe(false);
      expect(status.capabilities.commandExecution).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty command", async () => {
      vi.mocked(Linking.canOpenURL).mockResolvedValue(true);
      vi.mocked(Linking.openURL).mockResolvedValue(true);
      
      const result = await executeTermuxCommand("");
      expect(result.success).toBe(true);
    });

    it("should handle special characters in command", async () => {
      vi.mocked(Linking.canOpenURL).mockResolvedValue(true);
      vi.mocked(Linking.openURL).mockResolvedValue(true);
      
      const result = await executeTermuxCommand("echo", ["Hello & World"]);
      expect(result.success).toBe(true);
    });

    it("should handle multiple rapid calls", async () => {
      vi.mocked(Linking.canOpenURL).mockResolvedValue(true);
      vi.mocked(Linking.openURL).mockResolvedValue(true);
      
      const results = await Promise.all([
        executeTermuxCommand("ls"),
        executeTermuxCommand("pwd"),
        executeTermuxCommand("whoami"),
      ]);
      
      results.forEach((result) => {
        expect(result.success).toBe(true);
      });
    });
  });
});
