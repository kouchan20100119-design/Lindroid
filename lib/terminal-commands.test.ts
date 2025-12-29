import { describe, it, expect, beforeEach } from "vitest";
import { TerminalEmulator } from "./terminal-commands";

describe("TerminalEmulator", () => {
  let emulator: TerminalEmulator;

  beforeEach(() => {
    emulator = new TerminalEmulator();
  });

  describe("Basic Commands", () => {
    it("should execute echo command", () => {
      const result = emulator.executeCommand("echo Hello World");
      expect(result).toBe("Hello World");
    });

    it("should execute whoami command", () => {
      const result = emulator.executeCommand("whoami");
      expect(result).toBe("lindroid-user");
    });

    it("should execute pwd command", () => {
      const result = emulator.executeCommand("pwd");
      expect(result).toBe("/home/lindroid-user");
    });

    it("should execute date command", () => {
      const result = emulator.executeCommand("date");
      expect(result).toContain("GMT");
    });

    it("should execute uname command", () => {
      const result = emulator.executeCommand("uname");
      expect(result).toBe("Linux");
    });

    it("should execute uname -a command", () => {
      const result = emulator.executeCommand("uname -a");
      expect(result).toContain("Linux lindroid");
    });

    it("should return clear signal", () => {
      const result = emulator.executeCommand("clear");
      expect(result).toBe("__CLEAR__");
    });

    it("should return error for unknown command", () => {
      const result = emulator.executeCommand("unknowncommand");
      expect(result).toContain("command not found");
    });
  });

  describe("Directory Navigation", () => {
    it("should list directory contents", () => {
      const result = emulator.executeCommand("ls");
      expect(result).toContain("Documents");
      expect(result).toContain("Downloads");
    });

    it("should change directory", () => {
      emulator.executeCommand("cd Documents");
      const pwd = emulator.executeCommand("pwd");
      expect(pwd).toBe("/home/lindroid-user/Documents");
    });

    it("should navigate to parent directory", () => {
      emulator.executeCommand("cd Documents");
      emulator.executeCommand("cd ..");
      const pwd = emulator.executeCommand("pwd");
      expect(pwd).toBe("/home/lindroid-user");
    });

    it("should navigate to root directory", () => {
      emulator.executeCommand("cd /");
      const pwd = emulator.executeCommand("pwd");
      expect(pwd).toBe("/");
    });

    it("should return error for non-existent directory", () => {
      const result = emulator.executeCommand("cd nonexistent");
      expect(result).toContain("No such directory");
    });
  });

  describe("File Operations", () => {
    it("should read file contents", () => {
      const result = emulator.executeCommand("cat readme.txt");
      expect(result).toContain("Welcome to Lindroid");
    });

    it("should create new file", () => {
      const result = emulator.executeCommand("touch newfile.txt");
      expect(result).toBe("");
      
      const ls = emulator.executeCommand("ls");
      expect(ls).toContain("newfile.txt");
    });

    it("should create new directory", () => {
      const result = emulator.executeCommand("mkdir testdir");
      expect(result).toBe("");
      
      const ls = emulator.executeCommand("ls");
      expect(ls).toContain("testdir");
    });

    it("should remove file", () => {
      emulator.executeCommand("touch tempfile.txt");
      const result = emulator.executeCommand("rm tempfile.txt");
      expect(result).toBe("");
      
      const ls = emulator.executeCommand("ls");
      expect(ls).not.toContain("tempfile.txt");
    });

    it("should return error when reading non-existent file", () => {
      const result = emulator.executeCommand("cat nonexistent.txt");
      expect(result).toContain("No such file");
    });
  });

  describe("Environment Variables", () => {
    it("should display environment variables", () => {
      const result = emulator.executeCommand("env");
      expect(result).toContain("USER=lindroid-user");
      expect(result).toContain("HOME=/home/lindroid-user");
    });

    it("should set environment variable", () => {
      const result = emulator.executeCommand("export TEST_VAR=test_value");
      expect(result).toBe("");
      
      const env = emulator.executeCommand("env");
      expect(env).toContain("TEST_VAR=test_value");
    });
  });

  describe("Help Command", () => {
    it("should display help message", () => {
      const result = emulator.executeCommand("help");
      expect(result).toContain("Available commands");
      expect(result).toContain("echo");
      expect(result).toContain("ls");
      expect(result).toContain("cd");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty command", () => {
      const result = emulator.executeCommand("");
      expect(result).toBe("");
    });

    it("should handle command with extra spaces", () => {
      const result = emulator.executeCommand("  echo   test  ");
      expect(result).toBe("test");
    });

    it("should handle case-insensitive commands", () => {
      const result1 = emulator.executeCommand("ECHO test");
      const result2 = emulator.executeCommand("Echo test");
      expect(result1).toBe("test");
      expect(result2).toBe("test");
    });
  });
});
