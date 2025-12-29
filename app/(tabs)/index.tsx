import { ScrollView, Text, View, TouchableOpacity, Platform, Alert } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useLanguage } from "@/lib/language-context";
import { loadSessions, type TerminalSession } from "@/lib/storage";

export default function HomeScreen() {
  const colors = useColors();
  const { t } = useLanguage();
  const [sessions, setSessions] = useState<TerminalSession[]>([]);

  useEffect(() => {
    loadSavedSessions();
  }, []);

  const loadSavedSessions = async () => {
    try {
      const data = await loadSessions();
      setSessions(data);
    } catch (error) {
      console.error("Failed to load sessions:", error);
    }
  };

  const navigateToTerminal = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/terminal" as any);
  };

  const navigateToGUIViewer = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/gui-viewer" as any);
  };

  const navigateToFileManager = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/file-manager" as any);
  };

  const navigateToTermuxSetup = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/termux-setup" as any);
  };

  const openSession = (sessionId: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/terminal?sessionId=${sessionId}` as any);
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6 px-4 py-6">
          {/* Header */}
          <View className="items-center gap-2 mb-4">
            <Text className="text-4xl font-bold text-foreground">{t.home.title}</Text>
            <Text className="text-base text-muted text-center">{t.home.subtitle}</Text>
          </View>

          {/* Main Action Buttons */}
          <View className="gap-4">
            {/* New Terminal Button */}
            <TouchableOpacity
              onPress={navigateToTerminal}
              className="bg-primary rounded-2xl p-6 active:opacity-80"
            >
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 bg-background/20 rounded-xl items-center justify-center">
                  <IconSymbol name="chevron.left.forwardslash.chevron.right" size={24} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-background">{t.home.newTerminal}</Text>
                  <Text className="text-sm text-background/80 mt-1">{t.home.newTerminalDesc}</Text>
                </View>
                <IconSymbol name="chevron.right" size={24} color="white" />
              </View>
            </TouchableOpacity>

            {/* GUI Viewer Button */}
            <TouchableOpacity
              onPress={navigateToGUIViewer}
              className="bg-surface rounded-2xl p-6 border border-border active:opacity-70"
            >
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 bg-primary/10 rounded-xl items-center justify-center">
                  <IconSymbol name="chevron.left.forwardslash.chevron.right" size={24} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-foreground">{t.home.guiViewer}</Text>
                  <Text className="text-sm text-muted mt-1">{t.home.guiViewerDesc}</Text>
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
                  <Text className="text-lg font-semibold text-foreground">{t.home.fileManager}</Text>
                  <Text className="text-sm text-muted mt-1">{t.home.fileManagerDesc}</Text>
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
                  <Text className="text-lg font-semibold text-foreground">{t.home.termuxIntegration}</Text>
                  <Text className="text-sm text-muted mt-1">{t.home.termuxIntegrationDesc}</Text>
                </View>
                <IconSymbol name="chevron.right" size={24} color={colors.muted} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Saved Sessions Section */}
          <View className="mt-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold text-foreground">{t.home.savedSessions}</Text>
              {sessions.length > 0 && (
                <Text className="text-sm text-muted">{sessions.length}</Text>
              )}
            </View>

            {sessions.length === 0 ? (
              <View className="bg-surface rounded-2xl p-6 border border-border items-center">
                <IconSymbol name="chevron.left.forwardslash.chevron.right" size={32} color={colors.muted} />
                <Text className="text-base font-semibold text-foreground mt-3">{t.home.noSessions}</Text>
                <Text className="text-sm text-muted mt-1 text-center">{t.home.noSessionsDesc}</Text>
              </View>
            ) : (
              <View className="gap-2">
                {sessions.map((session) => (
                  <TouchableOpacity
                    key={session.id}
                    onPress={() => openSession(session.id)}
                    className="bg-surface rounded-xl p-4 border border-border active:opacity-70"
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-foreground">{session.name}</Text>
                        <Text className="text-xs text-muted mt-1">
                          {new Date(session.createdAt).toLocaleString()}
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
