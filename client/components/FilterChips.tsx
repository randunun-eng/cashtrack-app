import React from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import type { TransactionCategory } from "@/types";

interface FilterChipsProps {
  selected: TransactionCategory | "all";
  onSelect: (category: TransactionCategory | "all") => void;
}

const categories: Array<{ value: TransactionCategory | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "supermarket", label: "Supermarket" },
  { value: "travel", label: "Travel" },
  { value: "dining", label: "Dining" },
  { value: "shopping", label: "Shopping" },
  { value: "bills", label: "Bills" },
];

export function FilterChips({ selected, onSelect }: FilterChipsProps) {
  const { theme } = useTheme();

  const handlePress = (value: TransactionCategory | "all") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(value);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((cat) => {
        const isSelected = selected === cat.value;
        return (
          <Pressable
            key={cat.value}
            onPress={() => handlePress(cat.value)}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected 
                  ? theme.primary 
                  : theme.backgroundSecondary,
              },
            ]}
            testID={`filter-chip-${cat.value}`}
          >
            <ThemedText
              style={[
                styles.chipText,
                {
                  color: isSelected ? "#FFFFFF" : theme.text,
                },
              ]}
            >
              {cat.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
