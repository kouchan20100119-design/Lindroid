import { Platform, Linking, Alert } from "react-native";
import * as FileSystem from "expo-file-system";

export interface TermuxCommand {
  command: string;
  args?: string[];
  workingDirectory?: string;
}

export interface TermuxExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  exitCode?: number;
}

export interface TermuxDetectionDebugInfo {
  urlSchemeCheck: boolean;
  urlSchemeError?: string;
  packageManagerCheck: boolean;
  packageManagerError?: string;
  fileSystemCheck: boolean;
  fileSystemError?: string;
  timestamp: string;
}

/**
 * Check if Termux is installed on the device using multiple detection methods
 * Note: On real devices, URL scheme detection may fail due to Android security restrictions
 * We use a more permissive approach to avoid false negatives
 */
export async function isTermuxInstalled(): Promise<boolean> {
  if (Platform.OS !== "android") {
    return false;
  }

  console.log("[Termux Detection] Starting detection...");

  // Try multiple detection methods
  const results = await Promise.allSettled([
    checkTermuxURLScheme(),
    checkTermuxFileSystem(),
    checkTermuxPackageManager(),
  ]);

  const detectionResults = results.map((result, index) => {
    const method = ["URLScheme", "FileSystem", "PackageManager"][index];
    if (result.status === "fulfilled") {
      console.log(`[Termux Detection] ${method}: ${result.value}`);
      return result.value;
    } else {
      console.log(`[Termux Detection] ${method} failed:`, result.reason);
      return false;
    }
  });

  const isInstalled = detectionResults.some((result) => result);
  console.log("[Termux Detection] Final result:", isInstalled);

  return isInstalled;
}

/**
 * Check Termux via URL scheme
 * Note: This may return false on some devices due to Android security restrictions
 */
async function checkTermuxURLScheme(): Promise<boolean> {
  try {
    // Try multiple URL schemes
    const schemes = [
      "termux://",
      "com.termux://",
      "termux://home",
    ];

    for (const scheme of schemes) {
      try {
        const canOpen = await Linking.canOpenURL(scheme);
        if (canOpen) {
          console.log(`[Termux Detection] URL Scheme ${scheme} check: true`);
          return true;
        }
      } catch (error) {
        console.log(`[Termux Detection] URL Scheme ${scheme} error:`, error);
      }
    }

    console.log("[Termux Detection] All URL Scheme checks failed");
    return false;
  } catch (error) {
    console.error("[Termux Detection] URL Scheme error:", error);
    return false;
  }
}

/**
 * Check Termux via file system (check if Termux home directory exists)
 * Note: This requires storage permissions
 */
async function checkTermuxFileSystem(): Promise<boolean> {
  try {
    // Try multiple possible Termux paths
    const paths = [
      "/data/data/com.termux/files/home",
      "/data/data/com.termux/files",
      "/data/data/com.termux",
    ];

    for (const path of paths) {
      try {
        const fileInfo = await FileSystem.getInfoAsync(path);
        if (fileInfo.exists) {
          console.log(`[Termux Detection] File system check: true (${path})`);
          return true;
        }
      } catch (error) {
        console.log(`[Termux Detection] File system check failed for ${path}:`, error);
      }
    }

    console.log("[Termux Detection] All file system checks failed");
    return false;
  } catch (error) {
    console.error("[Termux Detection] File system error:", error);
    return false;
  }
}

/**
 * Check Termux via package manager URL scheme
 */
async function checkTermuxPackageManager(): Promise<boolean> {
  try {
    const schemes = [
      "termux://open",
      "termux://run",
    ];

    for (const scheme of schemes) {
      try {
        const canOpen = await Linking.canOpenURL(scheme);
        if (canOpen) {
          console.log(`[Termux Detection] Package manager check: true (${scheme})`);
          return true;
        }
      } catch (error) {
        console.log(`[Termux Detection] Package manager check failed for ${scheme}:`, error);
      }
    }

    console.log("[Termux Detection] All package manager checks failed");
    return false;
  } catch (error) {
    console.error("[Termux Detection] Package manager error:", error);
    return false;
  }
}

/**
 * Get detailed debug information about Termux detection
 */
export async function getTermuxDetectionDebugInfo(): Promise<TermuxDetectionDebugInfo> {
  const debugInfo: TermuxDetectionDebugInfo = {
    urlSchemeCheck: false,
    packageManagerCheck: false,
    fileSystemCheck: false,
    timestamp: new Date().toISOString(),
  };

  // URL Scheme check
  try {
    debugInfo.urlSchemeCheck = await checkTermuxURLScheme();
  } catch (error) {
    debugInfo.urlSchemeError = error instanceof Error ? error.message : "Unknown error";
  }

  // File system check
  try {
    debugInfo.fileSystemCheck = await checkTermuxFileSystem();
  } catch (error) {
    debugInfo.fileSystemError = error instanceof Error ? error.message : "Unknown error";
  }

  // Package manager check
  try {
    debugInfo.packageManagerCheck = await checkTermuxPackageManager();
  } catch (error) {
    debugInfo.packageManagerError = error instanceof Error ? error.message : "Unknown error";
  }

  return debugInfo;
}

/**
 * Open Termux app
 */
export async function openTermux(): Promise<boolean> {
  try {
    // Try multiple URL schemes to open Termux
    const schemes = [
      "termux://",
      "com.termux://",
      "termux://home",
    ];

    for (const scheme of schemes) {
      try {
        const canOpen = await Linking.canOpenURL(scheme);
        if (canOpen) {
          await Linking.openURL(scheme);
          return true;
        }
      } catch (error) {
        console.log(`[Termux] Failed to open with ${scheme}:`, error);
      }
    }

    return false;
  } catch (error) {
    console.error("Error opening Termux:", error);
    return false;
  }
}

/**
 * Execute command in Termux using URL scheme
 * Note: This requires Termux:API to be installed
 */
export async function executeTermuxCommand(
  command: string,
  args: string[] = []
): Promise<TermuxExecutionResult> {
  try {
    const installed = await isTermuxInstalled();
    if (!installed) {
      return {
        success: false,
        error: "Termux is not installed. Please install Termux from F-Droid or Google Play.",
      };
    }

    // Build command URL - use the correct Termux URL scheme
    const fullCommand = [command, ...args].join(" ");
    const encodedCommand = encodeURIComponent(fullCommand);
    
    // Try multiple URL schemes
    const urlSchemes = [
      `termux://run?command=${encodedCommand}`,
      `termux://x/${encodedCommand}`,
      `termux://open?command=${encodedCommand}`,
    ];

    for (const url of urlSchemes) {
      try {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
          return {
            success: true,
            output: "Command sent to Termux",
          };
        }
      } catch (error) {
        console.log(`[Termux] URL scheme ${url} not available:`, error);
        continue;
      }
    }

    return {
      success: false,
      error: "Cannot open Termux URL scheme. Ensure Termux is properly installed.",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get Termux home directory path
 */
export function getTermuxHomePath(): string {
  return "/data/data/com.termux/files/home";
}

/**
 * Get Termux shared storage path
 */
export function getTermuxSharedStoragePath(): string {
  return "/data/data/com.termux/files/home/storage/shared";
}

/**
 * Check if Termux:API is installed
 */
export async function isTermuxAPIInstalled(): Promise<boolean> {
  if (Platform.OS !== "android") {
    return false;
  }

  try {
    // Check if termux-api command is available via URL scheme
    const canOpen = await Linking.canOpenURL("termux://");
    if (!canOpen) {
      return false;
    }

    // Assume Termux:API is installed if Termux is installed
    // Actual verification requires running a command
    return true;
  } catch (error) {
    console.error("[Termux API] Detection error:", error);
    return false;
  }
}

/**
 * Open Termux settings
 */
export async function openTermuxSettings(): Promise<boolean> {
  try {
    const url = "termux://settings";
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error opening Termux settings:", error);
    return false;
  }
}

/**
 * Show Termux installation guide (Japanese)
 */
export function showTermuxInstallationGuide(): void {
  Alert.alert(
    "Termuxが必要です",
    "実際のLinuxシェル機能を使用するには、Termuxをインストールする必要があります:\n\n" +
      "1. F-Droid(推奨)またはGoogle PlayからTermuxをインストール\n" +
      "2. Termuxを開いて実行: pkg update && pkg upgrade\n" +
      "3. 高度な機能のためにTermux:APIをインストール\n" +
      "4. ストレージ権限を付与: termux-setup-storage\n\n" +
      "インストール後、Lindroidに戻ってTermux統合を使用してください。",
    [
      {
        text: "F-DROIDからインストール",
        onPress: () => {
          Linking.openURL("https://f-droid.org/packages/com.termux/");
        },
      },
      {
        text: "PLAY STOREからインストール",
        onPress: () => {
          Linking.openURL("https://play.google.com/store/apps/details?id=com.termux");
        },
      },
      { text: "キャンセル", style: "cancel" },
    ]
  );
}

/**
 * Create a shell script in Termux
 */
export async function createTermuxScript(
  scriptName: string,
  scriptContent: string
): Promise<TermuxExecutionResult> {
  try {
    // This would require file system access to Termux directory
    // In practice, this needs Termux:API or shared storage
    return {
      success: false,
      error: "Direct script creation requires Termux:API or file sharing",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Termux integration status
 */
export interface TermuxStatus {
  installed: boolean;
  apiInstalled: boolean;
  version?: string;
  capabilities: {
    urlScheme: boolean;
    fileAccess: boolean;
    commandExecution: boolean;
  };
  debugInfo?: TermuxDetectionDebugInfo;
}

/**
 * Get Termux integration status with debug information
 */
export async function getTermuxStatus(): Promise<TermuxStatus> {
  const installed = await isTermuxInstalled();
  const apiInstalled = await isTermuxAPIInstalled();
  const debugInfo = await getTermuxDetectionDebugInfo();

  console.log("[Termux Status]", {
    installed,
    apiInstalled,
    debugInfo,
  });

  return {
    installed,
    apiInstalled,
    capabilities: {
      urlScheme: debugInfo.urlSchemeCheck,
      fileAccess: debugInfo.fileSystemCheck,
      commandExecution: installed,
    },
    debugInfo,
  };
}
