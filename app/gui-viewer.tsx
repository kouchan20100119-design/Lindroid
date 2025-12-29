import { View, Text, TextInput, TouchableOpacity, Platform, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function GuiViewerScreen() {
  const colors = useColors();
  const [host, setHost] = useState("localhost");
  const [port, setPort] = useState("5900");
  const [password, setPassword] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (!host || !port) {
      Alert.alert("Error", "Please enter host and port");
      return;
    }

    // Simulate connection (in real implementation, this would connect to VNC/X11 server)
    setIsConnected(true);
    Alert.alert(
      "Connection Simulated",
      `This is a demo. In production, this would connect to:\n${host}:${port}\n\nFull VNC/X11 client requires native module integration.`
    );
  };

  const handleDisconnect = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setIsConnected(false);
  };

  const handleBack = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  return (
    <ScreenContainer>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-border">
        <TouchableOpacity onPress={handleBack} className="active:opacity-60">
          <IconSymbol name="chevron.left.forwardslash.chevron.right" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-foreground">GUI Viewer</Text>
        <View className="w-6" />
      </View>

      {/* Content */}
      <View className="flex-1 p-6">
        {!isConnected ? (
          <View className="gap-6">
            {/* Info Card */}
            <View className="bg-surface rounded-2xl p-6 border border-border">
              <Text className="text-base font-semibold text-foreground mb-2">
                VNC/X11 Connection
              </Text>
              <Text className="text-sm text-muted leading-relaxed">
                Connect to a VNC or X11 server to display Linux GUI applications. Make sure the
                server is running and accessible.
              </Text>
            </View>

            {/* Connection Form */}
            <View className="gap-4">
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Host Address</Text>
                <TextInput
                  value={host}
                  onChangeText={setHost}
                  placeholder="localhost or IP address"
                  placeholderTextColor={colors.muted}
                  className="px-4 py-3 rounded-xl border text-foreground"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Port</Text>
                <TextInput
                  value={port}
                  onChangeText={setPort}
                  placeholder="5900"
                  placeholderTextColor={colors.muted}
                  keyboardType="number-pad"
                  className="px-4 py-3 rounded-xl border text-foreground"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  }}
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-foreground mb-2">
                  Password (Optional)
                </Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter password if required"
                  placeholderTextColor={colors.muted}
                  secureTextEntry
                  className="px-4 py-3 rounded-xl border text-foreground"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  }}
                />
              </View>

              <TouchableOpacity
                onPress={handleConnect}
                className="bg-primary rounded-xl py-4 mt-2 active:opacity-80"
              >
                <Text className="text-center text-base font-semibold text-background">
                  Connect
                </Text>
              </TouchableOpacity>
            </View>

            {/* Note */}
            <View className="bg-warning/10 rounded-xl p-4 border border-warning/30">
              <Text className="text-sm text-foreground">
                <Text className="font-semibold">Note:</Text> Full VNC/X11 client functionality
                requires native module integration. This demo shows the UI structure.
              </Text>
            </View>
          </View>
        ) : (
          <View className="flex-1 gap-4">
            {/* Connected State */}
            <View className="bg-success/10 rounded-xl p-4 border border-success/30">
              <Text className="text-sm font-semibold text-foreground">
                Connected to {host}:{port}
              </Text>
            </View>

            {/* Display Area */}
            <View className="flex-1 bg-surface rounded-2xl border border-border items-center justify-center">
              <IconSymbol name="chevron.left.forwardslash.chevron.right" size={64} color={colors.muted} />
              <Text className="text-muted mt-4">GUI Display Area</Text>
              <Text className="text-sm text-muted mt-2 text-center px-6">
                VNC/X11 stream would appear here
              </Text>
            </View>

            {/* Disconnect Button */}
            <TouchableOpacity
              onPress={handleDisconnect}
              className="bg-error rounded-xl py-4 active:opacity-80"
            >
              <Text className="text-center text-base font-semibold text-background">
                Disconnect
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}
