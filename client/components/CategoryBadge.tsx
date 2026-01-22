import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { CategoryColors, BorderRadius, Spacing } from "@/constants/theme";
import type { TransactionCategory } from "@/types";

interface CategoryBadgeProps {
  category: TransactionCategory;
  showLabel?: boolean;
  size?: "small" | "medium";
}

const categoryIcons: Record<TransactionCategory, keyof typeof Feather.glyphMap> = {
  supermarket: "shopping-cart",
  travel: "map-pin",
  dining: "coffee",
  shopping: "shopping-bag",
  bills: "file-text",
  other: "more-horizontal",
};

const categoryLabels: Record<TransactionCategory, string> = {
  supermarket: "Supermarket",
  travel: "Travel",
  dining: "Dining",
  shopping: "Shopping",
  bills: "Bills",
  other: "Other",
};

export function CategoryBadge({ 
  category, 
  showLabel = true,
  size = "medium" 
}: CategoryBadgeProps) {
  const { isDark } = useTheme();
  const colorKey = isDark ? "dark" : "light";
  const color = CategoryColors[category]?.[colorKey] || CategoryColors.other[colorKey];
  
  const iconSize = size === "small" ? 12 : 16;
  const paddingH = size === "small" ? Spacing.sm : Spacing.md;
  const paddingV = size === "small" ? Spacing.xs : Spacing.sm;

  return (
    <View 
      style={[
        styles.badge, 
        { 
          backgroundColor: `${color}20`,
          paddingHorizontal: paddingH,
          paddingVertical: paddingV,
        }
      ]}
    >
      <Feather name={categoryIcons[category]} size={iconSize} color={color} />
      {showLabel ? (
        <ThemedText 
          style={[
            styles.label, 
            { color, fontSize: size === "small" ? 11 : 12 }
          ]}
        >
          {categoryLabels[category]}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.xs,
    gap: Spacing.xs,
  },
  label: {
    fontWeight: "500",
  },
});
