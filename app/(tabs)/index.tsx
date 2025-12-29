import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { loadSessions, deleteSession, type TerminalSession } from "@/lib/storage";

export default function HomeScreen() {
  const colors = useColors();
  const [sessions, setSessions] = useState<TerminalSession[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadSessionsData();
    }, [])
  );

  const loadSessionsData = async () => {
    try {
      const data = await loadSessions();
      setSessions(data.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
    } catch (error) {
      console.error("Failed to load sessions:", error);
    }
  };

  const navigateToTerminal = () => {
    router.push("/terminal" as any);
  };

  const navigateToGuiViewer = () => {
    router.push("/gui-viewer" as any);
  };

  const navigateToFileManager = () => {
    router.push("/file-manager" as any);
  };

  const navigateToSettings = () => {
    router.push("/settings" as any);
  };

  const navigateToTermuxSetup = () => {
    router.push("/termux-setup" as any);
  };

  const openSession = (sessionId: string) => {
    router.push(`/terminal?sessionId=${sessionId}` as any);
  };

  const handleDeleteSession = async (sessionId: string, sessionName: string) => {
    Alert.alert(
      "Delete Session",
      `Are you sure you want to delete "${sessionName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteSession(sessionId);
              await loadSessionsData();
            } catch (error) {
              Alert.alert("Error", "Failed to delete session");
            }
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Hero Section */}
          <View className="items-center gap-3 mt-8">
            <View className="w-24 h-24 bg-primary rounded-3xl items-center justify-center">
              <IconSymbol name="chevron.left.forwardslash.chevron.right" size={48} color="#0D1117" />
            </View>
            <Text className="text-3xl font-bold text-foreground">Lindroid</Text>
            <Text className="text-base text-muted text-center px-4">
              Linux Terminal Emulator with GUI Support
            </Text>
          </View>

          {/* Main Actions */}
          <View className="gap-4 mt-4">
            {/* New Terminal Session Button */}
            <TouchableOpacity
              onPress={navigateToTerminal}
              className="bg-primary rounded-2xl p-6 active:opacity-80"
            >
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 bg-background/20 rounded-xl items-center justify-center">
                  <IconSymbol name="chevron.left.forwardslash.chevron.right" size={24} color="#0D1117" />
                </View>
                <View className="flex-1">
                  <Text className="text-xl font-bold text-background">New Terminal Session</Text>
                  <Text className="text-sm text-background/80 mt-1">Start a new Linux terminal</Text>
                </View>
                <IconSymbol name="chevron.right" size={24} color="#0D1117" />
              </View>
            </TouchableOpacity>

            {/* GUI Viewer Button */}
            <TouchableOpacity
              onPress={navigateToGuiViewer}
              className="bg-surface rounded-2xl p-6 border border-border active:opacity-70"
            >
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 bg-primary/10 rounded-xl items-center justify-center">
                  <IconSymbol name="chevron.left.forwardslash.chevron.right" size={24} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-foreground">GUI Viewer</Text>
                  <Text className="text-sm text-muted mt-1">Connect to VNC/X11 display</Text>
                </View>
                <IconSymbol name="chevron.right" size={24} color={colors.muted} />
              </View>
            </TouchableOpacity>

            {/* File Manager Button */}
            <TouchableOpacity
              onPress={navigateToFileManager}
              className="bg-surface rounded-2xl p-6 border border-border active:opacity-70"
            >
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 bg-primary/10 rounded-xl items-center justify-center">
                  <IconSymbol name="house.fill" size={24} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-foreground">File Manager</Text>
                  <Text className="text-sm text-muted mt-1">Browse Linux filesystem</Text>
                </View>
                <IconSymbol name="chevron.right" size={24} color={colors.muted} />
              </View>
            </TouchableOpacity>

            {/* Termux Setup Button */}
            <TouchableOpacity
              onPress={navigateToTermuxSetup}
              className="bg-surface rounded-2xl p-6 border border-border active:opacity-70"
            >
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 bg-primary/10 rounded-xl items-center justify-center">
                  <IconSymbol name="chevron.left.forwardslash.chevron.right" size={24} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-foreground">Termux Integration</Text>
                  <Text className="text-sm text-muted mt-1">Setup real Linux shell</Text>
                </View>
                <IconSymbol name="chevron.right" size={24} color={colors.muted} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Saved Sessions Section */}
          <View className="mt-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-semibold text-foreground">Saved Sessions</Text>
              <TouchableOpacity onPress={navigateToSettings} className="active:opacity-60">
                <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                  Settings
                </Text>
              </TouchableOpacity>
            </View>
            
            {sessions.length === 0 ? (
              <View className="bg-surface rounded-2xl p-6 border border-border">
                <Text className="text-sm text-muted text-center">No saved sessions yet</Text>
                <Text className="text-xs text-muted text-center mt-2">
                  Create a terminal session and save it to see it here
                </Text>
              </View>
            ) : (
              <View className="gap-3">
                {sessions.map((session) => (
                  <TouchableOpacity
                    key={session.id}
                    onPress={() => openSession(session.id)}
                    onLongPress={() => handleDeleteSession(session.id, session.name)}
                    className="bg-surface rounded-xl p-4 border border-border active:opacity-70"
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-foreground">
                          {session.name}
                        </Text>
                        <Text className="text-xs text-muted mt-1">
                          {session.history.length} commands • Updated{" "}
                          {session.updatedAt.toLocaleDateString()}
                        </Text>
                      </View>
                      <IconSymbol name="chevron.right" size={20} color={colors.muted} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
