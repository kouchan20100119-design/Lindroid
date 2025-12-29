import { View, Text, TouchableOpacity, ScrollView, Platform, Linking } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useLanguage } from "@/lib/language-context";
import {
  getTermuxStatus,
  openTermux,
  showTermuxInstallationGuide,
  type TermuxStatus,
} from "@/lib/termux-integration";

export default function TermuxSetupScreen() {
  const colors = useColors();
  const { t } = useLanguage();
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
        <Text className="text-lg font-semibold text-foreground">{t.termuxSetup.title}</Text>
        <TouchableOpacity onPress={checkStatus} className="active:opacity-60">
          <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
            {t.common.back}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 p-6">
        {/* Status Card */}
        <View className="bg-surface rounded-2xl p-6 border border-border mb-6">
          <Text className="text-xl font-bold text-foreground mb-4">{t.termuxSetup.integrationStatus}</Text>
          
          {checking ? (
            <Text className="text-muted">{t.termuxSetup.checking}</Text>
          ) : (
            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-foreground">{t.termuxSetup.termuxInstalled}</Text>
                <StatusIndicator active={status?.installed || false} />
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-foreground">{t.termuxSetup.termuxAPI}</Text>
                <StatusIndicator active={status?.apiInstalled || false} />
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-foreground">{t.termuxSetup.urlScheme}</Text>
                <StatusIndicator active={status?.capabilities.urlScheme || false} />
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-foreground">{t.termuxSetup.commandExecution}</Text>
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
                {t.termuxSetup.openTermux}
              </Text>
            </TouchableOpacity>

            <View className="bg-success/10 rounded-xl p-4 border border-success/30">
              <Text className="text-sm text-foreground">
                <Text className="font-semibold">✓ {t.termuxSetup.termuxInstalled}</Text>
                {"\n\n"}
                ターミナルでTermuxモードを使用して、実際のLinuxコマンドを実行できます。
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
                {t.termuxSetup.installTermux}
              </Text>
            </TouchableOpacity>

            <View className="bg-warning/10 rounded-xl p-4 border border-warning/30">
              <Text className="text-sm text-foreground">
                <Text className="font-semibold">⚠ {t.termuxSetup.termuxNotDetected}</Text>
                {"\n\n"}
                {t.termuxSetup.termuxNotDetectedDesc}
              </Text>
            </View>
          </View>
        )}

        {/* Setup Instructions */}
        <View className="bg-surface rounded-2xl p-6 border border-border mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">{t.termuxSetup.setupInstructions}</Text>
          
          <View className="gap-4">
            <View>
              <Text className="text-base font-semibold text-foreground mb-2">
                {t.termuxSetup.step1}
              </Text>
              <Text className="text-sm text-muted leading-relaxed">
                {t.termuxSetup.step1Desc}
              </Text>
            </View>

            <View>
              <Text className="text-base font-semibold text-foreground mb-2">
                {t.termuxSetup.step2}
              </Text>
              <Text className="text-sm text-muted leading-relaxed">
                Termuxを開いて実行:{"\n"}
                <Text className="font-mono">pkg update && pkg upgrade</Text>
              </Text>
            </View>

            <View>
              <Text className="text-base font-semibold text-foreground mb-2">
                3. ストレージアクセス (オプション)
              </Text>
              <Text className="text-sm text-muted leading-relaxed">
                ストレージアクセス権を付下:{"\n"}
                <Text className="font-mono">termux-setup-storage</Text>
              </Text>
            </View>

            <View>
              <Text className="text-base font-semibold text-foreground mb-2">
                4. Termux:APIをインストール (オプション)
              </Text>
              <Text className="text-sm text-muted leading-relaxed">
                高度な機能のため、F-DroidまたはPlay StoreからTermux:APIをインストールして実行:{"\n"}
                <Text className="font-mono">pkg install termux-api</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Features Card */}
        <View className="bg-surface rounded-2xl p-6 border border-border mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">
            Termuxでできること
          </Text>
          
          <View className="gap-2">
            <Text className="text-sm text-muted leading-relaxed">
              • 実際bash/zshシェルを実行
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              • pkg/apt経由でパッケージをインストール
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              • Python、Node.js、Rubyなどを使用
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              • リモートサーバーへSSH接続
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              • Git、vim、tmuxなどを実行
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              • Androidストレージをアクセス
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
                {t.termuxSetup.documentation}
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
                {t.termuxSetup.wiki}
              </Text>
              <IconSymbol name="chevron.right" size={20} color={colors.muted} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
