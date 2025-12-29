import { View, Text, TouchableOpacity, FlatList, Platform, Alert, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { virtualFS, type FileSystemNode } from "@/lib/terminal-commands";

interface FileItem {
  name: string;
  type: "file" | "directory";
  size?: string;
  modified: string;
  node: FileSystemNode;
}

export default function FileManagerScreen() {
  const colors = useColors();
  const [currentPath, setCurrentPath] = useState<string[]>(["home", "lindroid-user"]);
  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    loadDirectory();
  }, [currentPath]);

  const loadDirectory = () => {
    let current: any = virtualFS;
    for (const segment of currentPath) {
      if (current[segment]) {
        current = current[segment].children || current[segment];
      }
    }

    if (current && typeof current === "object") {
      const items: FileItem[] = [];
      for (const [name, node] of Object.entries(current)) {
        if (typeof node === "object" && node && "type" in node) {
          const fileNode = node as FileSystemNode;
          items.push({
            name: fileNode.name,
            type: fileNode.type,
            size: fileNode.type === "file" ? `${(fileNode.content?.length || 0)} bytes` : undefined,
            modified: new Date().toLocaleDateString(),
            node: fileNode,
          });
        }
      }
      // Sort: directories first, then files
      items.sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === "directory" ? -1 : 1;
      });
      setFiles(items);
    }
  };

  const getPathString = () => {
    return "/" + currentPath.join("/");
  };

  const navigateUp = () => {
    if (currentPath.length > 0) {
      setCurrentPath((prev) => prev.slice(0, -1));
    }
  };

  const handleBack = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleItemPress = (item: FileItem) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (item.type === "directory") {
      setCurrentPath((prev) => [...prev, item.name]);
    } else {
      // Show file content
      Alert.alert(
        item.name,
        item.node.content || "(empty file)",
        [{ text: "OK" }]
      );
    }
  };

  const handleItemLongPress = (item: FileItem) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    Alert.alert(
      item.name,
      "Choose an action",
      [
        {
          text: "View",
          onPress: () => {
            if (item.type === "file") {
              Alert.alert(item.name, item.node.content || "(empty file)");
            }
          },
        },
        {
          text: "Rename",
          onPress: () => handleRename(item),
        },
        {
          text: "Delete",
          onPress: () => handleDelete(item),
          style: "destructive",
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handleRename = (item: FileItem) => {
    Alert.prompt(
      "Rename",
      `Enter new name for "${item.name}"`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Rename",
          onPress: (newName?: string) => {
            if (newName && newName.trim()) {
              // Get parent node
              let parent: any = virtualFS;
              for (const segment of currentPath) {
                parent = parent[segment].children || parent[segment];
              }

              if (parent[newName.trim()]) {
                Alert.alert("Error", "A file or directory with that name already exists");
                return;
              }

              // Rename
              parent[newName.trim()] = { ...item.node, name: newName.trim() };
              delete parent[item.name];
              loadDirectory();
            }
          },
        },
      ],
      "plain-text",
      item.name
    );
  };

  const handleDelete = (item: FileItem) => {
    Alert.alert(
      "Delete",
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // Get parent node
            let parent: any = virtualFS;
            for (const segment of currentPath) {
              parent = parent[segment].children || parent[segment];
            }

            delete parent[item.name];
            loadDirectory();
          },
        },
      ]
    );
  };

  const handleNewFolder = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    Alert.prompt(
      "New Folder",
      "Enter folder name",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Create",
          onPress: (name?: string) => {
            if (name && name.trim()) {
              // Get current node
              let current: any = virtualFS;
              for (const segment of currentPath) {
                current = current[segment].children || current[segment];
              }

              if (current[name.trim()]) {
                Alert.alert("Error", "A file or directory with that name already exists");
                return;
              }

              current[name.trim()] = {
                name: name.trim(),
                type: "directory",
                children: {},
              };
              loadDirectory();
            }
          },
        },
      ],
      "plain-text"
    );
  };

  const handleNewFile = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    Alert.prompt(
      "New File",
      "Enter file name",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Create",
          onPress: (name?: string) => {
            if (name && name.trim()) {
              // Get current node
              let current: any = virtualFS;
              for (const segment of currentPath) {
                current = current[segment].children || current[segment];
              }

              if (current[name.trim()]) {
                Alert.alert("Error", "A file or directory with that name already exists");
                return;
              }

              current[name.trim()] = {
                name: name.trim(),
                type: "file",
                content: "",
              };
              loadDirectory();
            }
          },
        },
      ],
      "plain-text"
    );
  };

  const renderItem = ({ item }: { item: FileItem }) => (
    <TouchableOpacity
      onPress={() => handleItemPress(item)}
      onLongPress={() => handleItemLongPress(item)}
      className="flex-row items-center gap-3 px-4 py-3 border-b border-border active:opacity-70"
      style={{ backgroundColor: colors.background }}
    >
      <View
        className="w-10 h-10 rounded-lg items-center justify-center"
        style={{ backgroundColor: item.type === "directory" ? colors.primary + "20" : colors.surface }}
      >
        <IconSymbol
          name={item.type === "directory" ? "house.fill" : "chevron.left.forwardslash.chevron.right"}
          size={20}
          color={item.type === "directory" ? colors.primary : colors.muted}
        />
      </View>
      <View className="flex-1">
        <Text className="text-base font-medium text-foreground">{item.name}</Text>
        <Text className="text-xs text-muted mt-1">
          {item.type === "directory" ? "Folder" : item.size} • {item.modified}
        </Text>
      </View>
      <IconSymbol name="chevron.right" size={20} color={colors.muted} />
    </TouchableOpacity>
  );

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      {/* Header */}
      <View className="border-b border-border">
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity onPress={handleBack} className="active:opacity-60">
            <IconSymbol name="chevron.left.forwardslash.chevron.right" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-foreground">File Manager</Text>
          <View className="w-6" />
        </View>

        {/* Path Breadcrumb */}
        <View className="flex-row items-center px-4 py-2 gap-2">
          {currentPath.length > 0 && (
            <TouchableOpacity onPress={navigateUp} className="active:opacity-60">
              <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                ← Up
              </Text>
            </TouchableOpacity>
          )}
          <Text className="text-sm text-muted flex-1">{getPathString()}</Text>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-2 px-4 py-2">
          <TouchableOpacity
            onPress={handleNewFolder}
            className="flex-1 bg-primary rounded-lg py-2 active:opacity-80"
          >
            <Text className="text-center text-sm font-semibold text-background">
              New Folder
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNewFile}
            className="flex-1 bg-surface border border-border rounded-lg py-2 active:opacity-70"
          >
            <Text className="text-center text-sm font-semibold text-foreground">
              New File
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* File List */}
      {files.length === 0 ? (
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-muted text-center">Empty directory</Text>
          <Text className="text-sm text-muted text-center mt-2">
            Create a new file or folder to get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={files}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* Info Footer */}
      <View className="px-4 py-3 border-t border-border">
        <Text className="text-xs text-muted text-center">
          {files.length} items • Long press for options
        </Text>
      </View>
    </ScreenContainer>
  );
}
