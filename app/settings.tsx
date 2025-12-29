import { View, Text, TouchableOpacity, ScrollView, Platform, Alert } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { loadSettings, saveSettings, type AppSettings } from "@/lib/storage";

export default function SettingsScreen() {
  const colors = useColors();
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
      Alert.alert("Error", "Failed to save settings");
    }
  };

  const handleBack = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
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
        <TouchableOpacity onPress={handleBack} className="active:opacity-60">
          <IconSymbol name="chevron.left.forwardslash.chevron.right" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-foreground">Settings</Text>
        <View className="w-6" />
      </View>

      {/* Content */}
      <ScrollView className="flex-1 p-6">
        {/* General Settings */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-foreground mb-4">General</Text>
          
          <SettingOption
            label="Theme"
            value={settings.theme}
            options={[
              { label: "System", value: "system" },
              { label: "Light", value: "light" },
              { label: "Dark", value: "dark" },
            ]}
            onSelect={(value) => updateSetting("theme", value)}
          />
        </View>

        {/* Terminal Settings */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-foreground mb-4">Terminal</Text>
          
          <SettingOption
            label="Font Size"
            value={settings.terminalFontSize}
            options={[
              { label: "Small (12)", value: 12 },
              { label: "Medium (14)", value: 14 },
              { label: "Large (16)", value: 16 },
              { label: "Extra Large (18)", value: 18 },
            ]}
            onSelect={(value) => updateSetting("terminalFontSize", value)}
          />

          <SettingOption
            label="Color Scheme"
            value={settings.terminalColorScheme}
            options={[
              { label: "Default (Green)", value: "default" },
              { label: "Blue", value: "blue" },
              { label: "Amber", value: "amber" },
            ]}
            onSelect={(value) => updateSetting("terminalColorScheme", value)}
          />
        </View>

        {/* About Section */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-foreground mb-4">About</Text>
          
          <View className="bg-surface rounded-2xl p-6 border border-border">
            <Text className="text-base font-semibold text-foreground mb-2">
              Lindroid
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              Version 1.0.0
            </Text>
            <Text className="text-sm text-muted leading-relaxed mt-2">
              A Linux terminal emulator with GUI support for mobile devices.
            </Text>
            <Text className="text-sm text-muted leading-relaxed mt-4">
              Features:
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              • Full terminal emulation with command history
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              • Virtual filesystem simulation
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              • Session management
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              • VNC/X11 viewer support
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              • File manager
            </Text>
          </View>
        </View>

        {/* Info Note */}
        <View className="bg-primary/10 rounded-xl p-4 border border-primary/30 mb-6">
          <Text className="text-sm text-foreground">
            <Text className="font-semibold">Note:</Text> This app provides a simulated Linux
            environment. For full native Linux support, consider using Termux or similar solutions.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
