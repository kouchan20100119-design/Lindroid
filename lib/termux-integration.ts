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

/**
 * Check if Termux is installed on the device
 */
export async function isTermuxInstalled(): Promise<boolean> {
  if (Platform.OS !== "android") {
    return false;
  }

  try {
    // Try to open Termux URL scheme
    const canOpen = await Linking.canOpenURL("termux://");
    return canOpen;
  } catch (error) {
    console.error("Error checking Termux installation:", error);
    return false;
  }
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

    // Build command URL
    const fullCommand = [command, ...args].join(" ");
    const encodedCommand = encodeURIComponent(fullCommand);
    const termuxUrl = `termux://x/${encodedCommand}`;

    const canOpen = await Linking.canOpenURL(termuxUrl);
    if (canOpen) {
      await Linking.openURL(termuxUrl);
      return {
        success: true,
        output: "Command sent to Termux",
      };
    }

    return {
      success: false,
      error: "Cannot open Termux URL scheme",
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
    // Check if termux-api command is available
    // This is a heuristic check - actual availability requires running a command
    const canOpen = await Linking.canOpenURL("termux://");
    return canOpen; // Simplified check
  } catch (error) {
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
 * Show Termux installation guide
 */
export function showTermuxInstallationGuide(): void {
  Alert.alert(
    "Termux Required",
    "To use real Linux shell features, you need to install Termux:\n\n" +
      "1. Install Termux from F-Droid (recommended) or Google Play\n" +
      "2. Open Termux and run: pkg update && pkg upgrade\n" +
      "3. Install Termux:API for advanced features\n" +
      "4. Grant storage permissions: termux-setup-storage\n\n" +
      "After installation, return to Lindroid to use Termux integration.",
    [
      {
        text: "Install from F-Droid",
        onPress: () => {
          Linking.openURL("https://f-droid.org/packages/com.termux/");
        },
      },
      {
        text: "Install from Play Store",
        onPress: () => {
          Linking.openURL("https://play.google.com/store/apps/details?id=com.termux");
        },
      },
      { text: "Cancel", style: "cancel" },
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
}

/**
 * Get Termux integration status
 */
export async function getTermuxStatus(): Promise<TermuxStatus> {
  const installed = await isTermuxInstalled();
  const apiInstalled = await isTermuxAPIInstalled();

  return {
    installed,
    apiInstalled,
    capabilities: {
      urlScheme: installed,
      fileAccess: false, // Would require storage permissions
      commandExecution: installed,
    },
  };
}
