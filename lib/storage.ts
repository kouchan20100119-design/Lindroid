import AsyncStorage from "@react-native-async-storage/async-storage";

export interface TerminalSession {
  id: string;
  name: string;
  history: Array<{ command: string; output: string; timestamp: Date }>;
  createdAt: Date;
  updatedAt: Date;
}

const SESSIONS_KEY = "@lindroid_sessions";
const SETTINGS_KEY = "@lindroid_settings";

export interface AppSettings {
  theme: "light" | "dark" | "system";
  terminalFontSize: number;
  terminalColorScheme: "default" | "green" | "blue" | "amber";
}

const defaultSettings: AppSettings = {
  theme: "system",
  terminalFontSize: 14,
  terminalColorScheme: "default",
};

// Session Management
export async function saveSessions(sessions: TerminalSession[]): Promise<void> {
  try {
    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error("Failed to save sessions:", error);
    throw error;
  }
}

export async function loadSessions(): Promise<TerminalSession[]> {
  try {
    const data = await AsyncStorage.getItem(SESSIONS_KEY);
    if (!data) return [];
    
    const sessions = JSON.parse(data);
    // Convert date strings back to Date objects
    return sessions.map((session: any) => ({
      ...session,
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.updatedAt),
      history: session.history.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      })),
    }));
  } catch (error) {
    console.error("Failed to load sessions:", error);
    return [];
  }
}

export async function deleteSession(sessionId: string): Promise<void> {
  try {
    const sessions = await loadSessions();
    const filtered = sessions.filter((s) => s.id !== sessionId);
    await saveSessions(filtered);
  } catch (error) {
    console.error("Failed to delete session:", error);
    throw error;
  }
}

// Settings Management
export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save settings:", error);
    throw error;
  }
}

export async function loadSettings(): Promise<AppSettings> {
  try {
    const data = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!data) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(data) };
  } catch (error) {
    console.error("Failed to load settings:", error);
    return defaultSettings;
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
