import { View, Text, TextInput, ScrollView, TouchableOpacity, Platform, Alert, Switch } from "react-native";
import { useState, useRef, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useLanguage } from "@/lib/language-context";
import { TerminalEmulator } from "@/lib/terminal-commands";
import { saveSessions, loadSessions, generateId, type TerminalSession } from "@/lib/storage";
import {
  isTermuxInstalled,
  executeTermuxCommand,
  showTermuxInstallationGuide,
  getTermuxStatus,
  type TermuxStatus,
} from "@/lib/termux-integration";

interface CommandOutput {
  command: string;
  output: string;
  timestamp: Date;
}

export default function TerminalScreen() {
  const colors = useColors();
  const { t } = useLanguage();
  const params = useLocalSearchParams();
  const sessionId = params.sessionId as string | undefined;
  
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<CommandOutput[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentSessionId] = useState(sessionId || generateId());
  const [sessionName, setSessionName] = useState(`Session ${new Date().toLocaleTimeString()}`);
  const [promptPath, setPromptPath] = useState("/home/lindroid-user");
  const [termuxMode, setTermuxMode] = useState(false);
  const [termuxStatus, setTermuxStatus] = useState<TermuxStatus | null>(null);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const emulatorRef = useRef(new TerminalEmulator());

  useEffect(() => {
    // Load session if sessionId is provided
    if (sessionId) {
      loadSession(sessionId);
    }
    // Check Termux status
    checkTermuxStatus();
    // Auto-focus input on mount
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const checkTermuxStatus = async () => {
    const status = await getTermuxStatus();
    setTermuxStatus(status);
  };

  const loadSession = async (id: string) => {
    try {
      const sessions = await loadSessions();
      const session = sessions.find((s) => s.id === id);
      if (session) {
        setSessionName(session.name);
        setHistory(session.history);
        // Replay commands to restore terminal state
        session.history.forEach((entry) => {
          emulatorRef.current.executeCommand(entry.command);
        });
        setPromptPath(emulatorRef.current.getCurrentPath());
      }
    } catch (error) {
      console.error("Failed to load session:", error);
    }
  };

  const saveSession = async () => {
    try {
      const sessions = await loadSessions();
      const existingIndex = sessions.findIndex((s) => s.id === currentSessionId);
      
      const session: TerminalSession = {
        id: currentSessionId,
        name: sessionName,
        history,
        createdAt: existingIndex >= 0 ? sessions[existingIndex].createdAt : new Date(),
        updatedAt: new Date(),
      };

      if (existingIndex >= 0) {
        sessions[existingIndex] = session;
      } else {
        sessions.push(session);
      }

      await saveSessions(sessions);
      
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      Alert.alert(t.common.success, t.terminal.sessionSaved);
    } catch (error) {
      console.error("Failed to save session:", error);
      Alert.alert(t.common.error, t.terminal.sessionSaveError);
    }
  };

  const executeCommand = async (cmd: string) => {
    if (!cmd.trim()) return;

    // Add to command history
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    let output = "";

    if (termuxMode && termuxStatus?.installed) {
      // Execute in Termux
      const result = await executeTermuxCommand(cmd);
      if (result.success) {
        output = result.output || "Command sent to Termux";
      } else {
        output = `Error: ${result.error}`;
      }
    } else {
      // Execute in simulated environment
      output = emulatorRef.current.executeCommand(cmd);
      
      // Handle clear command
      if (output === "__CLEAR__") {
        setHistory([]);
        setCommand("");
        setPromptPath(emulatorRef.current.getCurrentPath());
        return;
      }
    }

    const newEntry: CommandOutput = {
      command: cmd,
      output,
      timestamp: new Date(),
    };

    setHistory((prev) => [...prev, newEntry]);
    setCommand("");
    if (!termuxMode) {
      setPromptPath(emulatorRef.current.getCurrentPath());
    }

    // Scroll to bottom after command execution
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSubmit = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    executeCommand(command);
  };

  const handleBack = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const navigateHistory = (direction: "up" | "down") => {
    if (commandHistory.length === 0) return;

    let newIndex = historyIndex;
    if (direction === "up") {
      newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
    } else {
      newIndex = historyIndex > -1 ? historyIndex - 1 : -1;
    }

    setHistoryIndex(newIndex);
    if (newIndex === -1) {
      setCommand("");
    } else {
      setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
    }
  };

  const handleTermuxModeToggle = async (value: boolean) => {
    if (value && !termuxStatus?.installed) {
      showTermuxInstallationGuide();
      return;
    }

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setTermuxMode(value);

    const newEntry: CommandOutput = {
      command: "",
      output: value
        ? "✓ Termux mode enabled - Commands will be sent to Termux app"
        : "✓ Simulation mode - Using built-in terminal emulator",
      timestamp: new Date(),
    };
    setHistory((prev) => [...prev, newEntry]);
  };

  return (
    <ScreenContainer edges={["top", "left", "right"]} containerClassName="bg-[#0D1117]">
      {/* Header */}
      <View className="border-b border-[#30363D]">
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity onPress={handleBack} className="active:opacity-60">
            <IconSymbol name="chevron.left.forwardslash.chevron.right" size={24} color="#00D084" />
          </TouchableOpacity>
          <Text className="text-base font-semibold" style={{ color: "#E6EDF3" }}>
            {sessionName}
          </Text>
          <TouchableOpacity onPress={saveSession} className="active:opacity-60">
            <Text className="text-sm font-semibold" style={{ color: "#00D084" }}>
              Save
            </Text>
          </TouchableOpacity>
        </View>

        {/* Termux Mode Toggle */}
        <View className="flex-row items-center justify-between px-4 py-2 border-t border-[#30363D]">
          <View className="flex-1">
            <Text className="text-sm font-medium" style={{ color: "#E6EDF3" }}>
              Termux Mode
            </Text>
            <Text className="text-xs mt-1" style={{ color: "#8B949E" }}>
              {termuxStatus?.installed
                ? "Execute commands in real Termux shell"
                : "Termux not installed - tap to learn more"}
            </Text>
          </View>
          <Switch
            value={termuxMode}
            onValueChange={handleTermuxModeToggle}
            trackColor={{ false: "#30363D", true: "#00D084" }}
            thumbColor={termuxMode ? "#FFFFFF" : "#8B949E"}
          />
        </View>
      </View>

      {/* Terminal Output */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4 py-3"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Welcome Message */}
        {history.length === 0 && (
          <View className="mb-4">
            <Text className="font-mono text-sm" style={{ color: "#00D084" }}>
              Welcome to Lindroid Terminal Emulator
            </Text>
            <Text className="font-mono text-sm mt-1" style={{ color: "#8B949E" }}>
              {termuxMode
                ? "Termux mode: Commands will be sent to Termux app"
                : "Simulation mode: Type 'help' for available commands"}
            </Text>
            <Text className="font-mono text-sm mt-1" style={{ color: "#8B949E" }}>
              {termuxStatus?.installed
                ? "✓ Termux detected - Toggle Termux mode above"
                : "⚠ Termux not installed - Using simulation mode"}
            </Text>
            <Text className="font-mono text-sm mt-1" style={{ color: "#8B949E" }}>
              {"\n"}
            </Text>
          </View>
        )}

        {/* Command History */}
        {history.map((entry, index) => (
          <View key={index} className="mb-3">
            {entry.command && (
              <Text className="font-mono text-sm" style={{ color: "#00D084" }}>
                {termuxMode ? "termux" : promptPath} $ {entry.command}
              </Text>
            )}
            {entry.output && (
              <Text className="font-mono text-sm mt-1" style={{ color: "#E6EDF3" }}>
                {entry.output}
              </Text>
            )}
          </View>
        ))}

        {/* Current Prompt */}
        <View className="flex-row items-center">
          <Text className="font-mono text-sm" style={{ color: "#00D084" }}>
            {termuxMode ? "termux" : promptPath} ${" "}
          </Text>
        </View>
      </ScrollView>

      {/* Input Area */}
      <View className="border-t border-[#30363D] px-4 py-3 pb-6">
        {/* History Navigation Buttons */}
        <View className="flex-row gap-2 mb-2">
          <TouchableOpacity
            onPress={() => navigateHistory("up")}
            className="flex-1 bg-[#161B22] border border-[#30363D] rounded-lg py-2 active:opacity-70"
          >
            <Text className="text-center text-sm" style={{ color: "#8B949E" }}>
              ↑ History
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigateHistory("down")}
            className="flex-1 bg-[#161B22] border border-[#30363D] rounded-lg py-2 active:opacity-70"
          >
            <Text className="text-center text-sm" style={{ color: "#8B949E" }}>
              ↓ History
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center gap-2">
          <TextInput
            ref={inputRef}
            value={command}
            onChangeText={setCommand}
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
            placeholder={termuxMode ? "Enter Termux command..." : "Enter command..."}
            placeholderTextColor="#8B949E"
            className="flex-1 font-mono text-sm px-3 py-2 rounded-lg border"
            style={{
              color: "#E6EDF3",
              backgroundColor: "#161B22",
              borderColor: "#30363D",
            }}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-primary px-4 py-2 rounded-lg active:opacity-80"
          >
            <IconSymbol name="paperplane.fill" size={20} color="#0D1117" />
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}
