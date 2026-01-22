import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Switch, Pressable, Alert, Platform, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { getSettings, saveSettings, clearAllData, type AppSettings } from "@/lib/storage";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();

  const [settings, setSettings] = useState<AppSettings>({
    calendarSyncEnabled: false,
    notificationsEnabled: true,
    theme: "system",
  });

  const loadSettings = useCallback(async () => {
    const loaded = await getSettings();
    setSettings(loaded);
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateSetting = async <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will remove all your cards, transactions, and promotions. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await clearAllData();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert("Data Cleared", "All data has been removed.");
          },
        },
      ]
    );
  };

  const renderSettingRow = (
    icon: keyof typeof Feather.glyphMap,
    title: string,
    description: string,
    rightElement: React.ReactNode
  ) => (
    <View style={[styles.settingRow, { borderBottomColor: theme.backgroundSecondary }]}>
      <View style={[styles.iconContainer, { backgroundColor: theme.backgroundSecondary }]}>
        <Feather name={icon} size={20} color={theme.primary} />
      </View>
      <View style={styles.settingContent}>
        <ThemedText type="body" style={styles.settingTitle}>
          {title}
        </ThemedText>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {description}
        </ThemedText>
      </View>
      {rightElement}
    </View>
  );

  const renderActionRow = (
    icon: keyof typeof Feather.glyphMap,
    title: string,
    onPress: () => void,
    destructive?: boolean
  ) => (
    <Pressable
      onPress={onPress}
      style={[styles.actionRow, { borderBottomColor: theme.backgroundSecondary }]}
    >
      <View 
        style={[
          styles.iconContainer, 
          { backgroundColor: destructive ? `${theme.error}20` : theme.backgroundSecondary }
        ]}
      >
        <Feather 
          name={icon} 
          size={20} 
          color={destructive ? theme.error : theme.primary} 
        />
      </View>
      <ThemedText 
        type="body" 
        style={[styles.actionTitle, destructive && { color: theme.error }]}
      >
        {title}
      </ThemedText>
      <Feather name="chevron-right" size={20} color={theme.textHint} />
    </Pressable>
  );

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: tabBarHeight + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <View style={[styles.section, { backgroundColor: theme.backgroundDefault }]}>
        <ThemedText type="small" style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          SYNC & NOTIFICATIONS
        </ThemedText>
        
        {renderSettingRow(
          "calendar",
          "Google Calendar Sync",
          "Sync promotions to your calendar",
          <Switch
            value={settings.calendarSyncEnabled}
            onValueChange={(value) => updateSetting("calendarSyncEnabled", value)}
            trackColor={{ false: theme.backgroundTertiary, true: theme.primaryLight }}
            thumbColor="#FFFFFF"
          />
        )}

        {renderSettingRow(
          "bell",
          "Notifications",
          "Get alerts for settlements and promos",
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={(value) => updateSetting("notificationsEnabled", value)}
            trackColor={{ false: theme.backgroundTertiary, true: theme.primaryLight }}
            thumbColor="#FFFFFF"
          />
        )}
      </View>

      <View style={[styles.section, { backgroundColor: theme.backgroundDefault }]}>
        <ThemedText type="small" style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          DATA
        </ThemedText>
        
        {renderActionRow("download", "Export Data", () => {
          Alert.alert("Export", "Data export feature coming soon!");
        })}
        
        {renderActionRow("trash-2", "Clear All Data", handleClearData, true)}
      </View>

      <View style={[styles.section, { backgroundColor: theme.backgroundDefault }]}>
        <ThemedText type="small" style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          ABOUT
        </ThemedText>
        
        {renderActionRow("info", "About CashTrack", () => {
          Alert.alert(
            "CashTrack",
            "Version 1.0.0\n\nTrack your cash flow, credit card settlements, and promotions all in one place."
          );
        })}
        
        {renderActionRow("shield", "Privacy Policy", () => {
          if (Platform.OS !== "web") {
            Linking.openURL("https://example.com/privacy");
          }
        })}
      </View>

      <ThemedText 
        type="small" 
        style={[styles.versionText, { color: theme.textHint }]}
      >
        CashTrack v1.0.0
      </ThemedText>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
    overflow: "hidden",
  },
  sectionTitle: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  settingContent: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingTitle: {
    fontWeight: "500",
    marginBottom: 2,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  actionTitle: {
    flex: 1,
    fontWeight: "500",
  },
  versionText: {
    textAlign: "center",
    marginTop: Spacing.lg,
  },
});
