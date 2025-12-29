import { View, Text, TouchableOpacity, ScrollView, Platform, Linking } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import {
  getTermuxStatus,
  openTermux,
  showTermuxInstallationGuide,
  type TermuxStatus,
} from "@/lib/termux-integration";

export default function TermuxSetupScreen() {
  const colors = useColors();
  const [status, setStatus] = useState<TermuxStatus | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setChecking(true);
    const termuxStatus = await getTermuxStatus();
    setStatus(termuxStatus);
    setChecking(false);
  };

  const handleBack = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleOpenTermux = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const success = await openTermux();
    if (!success) {
      showTermuxInstallationGuide();
    }
  };

  const handleInstallGuide = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    showTermuxInstallationGuide();
  };

  const StatusIndicator = ({ active }: { active: boolean }) => (
    <View
      className="w-3 h-3 rounded-full"
      style={{ backgroundColor: active ? colors.success : colors.error }}
    />
  );

  return (
    <ScreenContainer>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-border">
        <TouchableOpacity onPress={handleBack} className="active:opacity-60">
          <IconSymbol name="chevron.left.forwardslash.chevron.right" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-foreground">Termux Setup</Text>
        <TouchableOpacity onPress={checkStatus} className="active:opacity-60">
          <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
            Refresh
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 p-6">
        {/* Status Card */}
        <View className="bg-surface rounded-2xl p-6 border border-border mb-6">
          <Text className="text-xl font-bold text-foreground mb-4">Integration Status</Text>
          
          {checking ? (
            <Text className="text-muted">Checking Termux installation...</Text>
          ) : (
            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-foreground">Termux Installed</Text>
                <StatusIndicator active={status?.installed || false} />
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-foreground">Termux:API</Text>
                <StatusIndicator active={status?.apiInstalled || false} />
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-foreground">URL Scheme</Text>
                <StatusIndicator active={status?.capabilities.urlScheme || false} />
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-foreground">Command Execution</Text>
                <StatusIndicator active={status?.capabilities.commandExecution || false} />
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        {status?.installed ? (
          <View className="gap-4 mb-6">
            <TouchableOpacity
              onPress={handleOpenTermux}
              className="bg-primary rounded-xl py-4 active:opacity-80"
            >
              <Text className="text-center text-base font-semibold text-background">
                Open Termux
              </Text>
            </TouchableOpacity>

            <View className="bg-success/10 rounded-xl p-4 border border-success/30">
              <Text className="text-sm text-foreground">
                <Text className="font-semibold">✓ Termux is installed!</Text>
                {"\n\n"}
                You can now use Termux mode in the terminal to execute real Linux commands.
              </Text>
            </View>
          </View>
        ) : (
          <View className="gap-4 mb-6">
            <TouchableOpacity
              onPress={handleInstallGuide}
              className="bg-primary rounded-xl py-4 active:opacity-80"
            >
              <Text className="text-center text-base font-semibold text-background">
                Install Termux
              </Text>
            </TouchableOpacity>

            <View className="bg-warning/10 rounded-xl p-4 border border-warning/30">
              <Text className="text-sm text-foreground">
                <Text className="font-semibold">⚠ Termux not detected</Text>
                {"\n\n"}
                Install Termux to use real Linux shell features. Tap the button above for installation guide.
              </Text>
            </View>
          </View>
        )}

        {/* Setup Instructions */}
        <View className="bg-surface rounded-2xl p-6 border border-border mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">Setup Instructions</Text>
          
          <View className="gap-4">
            <View>
              <Text className="text-base font-semibold text-foreground mb-2">
                1. Install Termux
              </Text>
              <Text className="text-sm text-muted leading-relaxed">
                Download Termux from F-Droid (recommended) or Google Play Store. F-Droid version is more up-to-date.
              </Text>
            </View>

            <View>
              <Text className="text-base font-semibold text-foreground mb-2">
                2. Initial Setup
              </Text>
              <Text className="text-sm text-muted leading-relaxed">
                Open Termux and run:{"\n"}
                <Text className="font-mono">pkg update && pkg upgrade</Text>
              </Text>
            </View>

            <View>
              <Text className="text-base font-semibold text-foreground mb-2">
                3. Storage Access (Optional)
              </Text>
              <Text className="text-sm text-muted leading-relaxed">
                Grant storage permissions:{"\n"}
                <Text className="font-mono">termux-setup-storage</Text>
              </Text>
            </View>

            <View>
              <Text className="text-base font-semibold text-foreground mb-2">
                4. Install Termux:API (Optional)
              </Text>
              <Text className="text-sm text-muted leading-relaxed">
                For advanced features, install Termux:API from F-Droid or Play Store, then run:{"\n"}
                <Text className="font-mono">pkg install termux-api</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Features Card */}
        <View className="bg-surface rounded-2xl p-6 border border-border mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">
            What You Can Do with Termux
          </Text>
          
          <View className="gap-2">
            <Text className="text-sm text-muted leading-relaxed">
              • Run real bash/zsh shells
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              • Install packages via pkg/apt
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              • Use Python, Node.js, Ruby, etc.
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              • SSH into remote servers
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              • Run Git, vim, tmux, and more
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              • Access Android storage
            </Text>
          </View>
        </View>

        {/* Links */}
        <View className="gap-3 mb-6">
          <TouchableOpacity
            onPress={() => Linking.openURL("https://termux.dev/en/")}
            className="bg-surface border border-border rounded-xl p-4 active:opacity-70"
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-medium text-foreground">
                Termux Documentation
              </Text>
              <IconSymbol name="chevron.right" size={20} color={colors.muted} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Linking.openURL("https://wiki.termux.com/wiki/Main_Page")}
            className="bg-surface border border-border rounded-xl p-4 active:opacity-70"
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-medium text-foreground">
                Termux Wiki
              </Text>
              <IconSymbol name="chevron.right" size={20} color={colors.muted} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
