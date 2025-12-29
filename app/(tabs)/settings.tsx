import { View, Text, TouchableOpacity, ScrollView, Platform, Alert } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useLanguage } from "@/lib/language-context";
import { loadSettings, saveSettings, type AppSettings } from "@/lib/storage";

export default function SettingsScreen() {
  const colors = useColors();
  const { t, language, setLanguage } = useLanguage();
  const [settings, setSettings] = useState<AppSettings>({
    theme: "system",
    terminalFontSize: 14,
    terminalColorScheme: "default",
  });

  useEffect(() => {
    loadSettingsData();
  }, []);

  const loadSettingsData = async () => {
    try {
      const data = await loadSettings();
      setSettings(data);
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const updateSetting = async <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      await saveSettings(newSettings);
      
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      Alert.alert(t.common.error, "Failed to save settings");
    }
  };

  const handleLanguageChange = async (newLanguage: typeof language) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await setLanguage(newLanguage);
  };

  const SettingOption = ({
    label,
    value,
    options,
    onSelect,
  }: {
    label: string;
    value: string | number;
    options: Array<{ label: string; value: string | number }>;
    onSelect: (value: any) => void;
  }) => (
    <View className="mb-6">
      <Text className="text-sm font-medium text-foreground mb-3">{label}</Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => (
          <TouchableOpacity
            key={option.value.toString()}
            onPress={() => onSelect(option.value)}
            className={`px-4 py-2 rounded-lg border ${
              value === option.value ? "border-primary" : "border-border"
            }`}
            style={{
              backgroundColor: value === option.value ? colors.primary + "20" : colors.surface,
            }}
          >
            <Text
              className="text-sm font-medium"
              style={{
                color: value === option.value ? colors.primary : colors.foreground,
              }}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ScreenContainer>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-border">
        <Text className="text-lg font-semibold text-foreground">{t.settings.title}</Text>
        <View className="w-6" />
      </View>

      {/* Content */}
      <ScrollView className="flex-1 p-6">
        {/* Language Settings */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-foreground mb-4">{t.settings.general}</Text>
          
          <SettingOption
            label={t.settings.language}
            value={language}
            options={[
              { label: t.settings.english, value: "en" },
              { label: t.settings.japanese, value: "ja" },
            ]}
            onSelect={handleLanguageChange}
          />

          <SettingOption
            label={t.settings.theme}
            value={settings.theme}
            options={[
              { label: t.settings.system, value: "system" },
              { label: t.settings.light, value: "light" },
              { label: t.settings.dark, value: "dark" },
            ]}
            onSelect={(value) => updateSetting("theme", value)}
          />
        </View>

        {/* Terminal Settings */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-foreground mb-4">{t.settings.terminal}</Text>
          
          <SettingOption
            label={t.settings.fontSize}
            value={settings.terminalFontSize}
            options={[
              { label: t.settings.small, value: 12 },
              { label: t.settings.medium, value: 14 },
              { label: t.settings.large, value: 16 },
              { label: t.settings.extraLarge, value: 18 },
            ]}
            onSelect={(value) => updateSetting("terminalFontSize", value)}
          />

          <SettingOption
            label={t.settings.colorScheme}
            value={settings.terminalColorScheme}
            options={[
              { label: t.settings.default, value: "default" },
              { label: t.settings.blue, value: "blue" },
              { label: t.settings.amber, value: "amber" },
            ]}
            onSelect={(value) => updateSetting("terminalColorScheme", value)}
          />
        </View>

        {/* About Section */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-foreground mb-4">{t.settings.about}</Text>
          
          <View className="bg-surface rounded-2xl p-6 border border-border">
            <Text className="text-base font-semibold text-foreground mb-2">
              Lindroid
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              {t.settings.version}: 1.1.0
            </Text>
            <Text className="text-sm text-muted leading-relaxed mt-2">
              {t.settings.description}
            </Text>
            <Text className="text-sm text-muted leading-relaxed mt-4">
              {t.settings.features}
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              • {t.terminal.welcome}
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              • {t.fileManager.emptyDirectory}
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              • {t.termuxSetup.setupInstructions}
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              • {t.settings.language}
            </Text>
          </View>
        </View>

        {/* Info Note */}
        <View className="bg-primary/10 rounded-xl p-4 border border-primary/30 mb-6">
          <Text className="text-sm text-foreground">
            <Text className="font-semibold">{t.settings.note}</Text> {t.settings.noteDesc}
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
