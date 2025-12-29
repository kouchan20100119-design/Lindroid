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
 */
export async function isTermuxInstalled(): Promise<boolean> {
  if (Platform.OS !== "android") {
    return false;
  }

  // Try multiple detection methods
  const results = await Promise.all([
    checkTermuxURLScheme(),
    checkTermuxFileSystem(),
    checkTermuxPackageManager(),
  ]);

  return results.some((result) => result);
}

/**
 * Check Termux via URL scheme
 */
async function checkTermuxURLScheme(): Promise<boolean> {
  try {
    const canOpen = await Linking.canOpenURL("termux://");
    console.log("[Termux Detection] URL Scheme check:", canOpen);
    return canOpen;
  } catch (error) {
    console.error("[Termux Detection] URL Scheme error:", error);
    return false;
  }
}

/**
 * Check Termux via file system (check if Termux home directory exists)
 */
async function checkTermuxFileSystem(): Promise<boolean> {
  try {
    const termuxHomePath = getTermuxHomePath();
    const fileInfo = await FileSystem.getInfoAsync(termuxHomePath);
    const exists = fileInfo.exists;
    console.log("[Termux Detection] File system check:", exists, termuxHomePath);
    return exists;
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
    // Try to open Termux package manager
    const canOpen = await Linking.canOpenURL("termux://open?url=https://termux.dev");
    console.log("[Termux Detection] Package manager check:", canOpen);
    return canOpen;
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
    debugInfo.urlSchemeCheck = await Linking.canOpenURL("termux://");
  } catch (error) {
    debugInfo.urlSchemeError = error instanceof Error ? error.message : "Unknown error";
  }

  // File system check
  try {
    const termuxHomePath = getTermuxHomePath();
    const fileInfo = await FileSystem.getInfoAsync(termuxHomePath);
    debugInfo.fileSystemCheck = fileInfo.exists;
  } catch (error) {
    debugInfo.fileSystemError = error instanceof Error ? error.message : "Unknown error";
  }

  // Package manager check
  try {
    debugInfo.packageManagerCheck = await Linking.canOpenURL(
      "termux://open?url=https://termux.dev"
    );
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
    const canOpen = await Linking.canOpenURL("termux://");
    if (canOpen) {
      await Linking.openURL("termux://");
      return true;
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

    // Try to execute a simple termux-api command
    const result = await executeTermuxCommand("termux-api", ["sensor", "--help"]);
    return result.success;
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
        text: "F-Droidからインストール",
        onPress: () => {
          Linking.openURL("https://f-droid.org/packages/com.termux/");
        },
      },
      {
        text: "Play Storeからインストール",
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
      urlScheme: installed,
      fileAccess: debugInfo.fileSystemCheck,
      commandExecution: installed,
    },
    debugInfo,
  };
}
