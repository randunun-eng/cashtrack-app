import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import type { CreditCard } from "@/types";

interface BalanceSummaryProps {
  cards: CreditCard[];
}

export function BalanceSummary({ cards }: BalanceSummaryProps) {
  const { theme, isDark } = useTheme();

  const totalBalance = cards.reduce((sum, card) => sum + card.balance, 0);
  const totalLimit = cards.reduce((sum, card) => sum + card.limit, 0);
  const totalAvailable = totalLimit - totalBalance;
  const utilizationPercent = totalLimit > 0 ? (totalBalance / totalLimit) * 100 : 0;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const gradientColors: readonly [string, string, ...string[]] = isDark 
    ? ["#1B5E20", "#2E7D32"] 
    : ["#1B5E20", "#388E3C"];

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, Shadows.card]}
    >
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.label}>Total Balance</ThemedText>
          <ThemedText style={styles.amount}>{formatAmount(totalBalance)}</ThemedText>
        </View>
        <View style={styles.cardsCount}>
          <Feather name="credit-card" size={18} color="rgba(255,255,255,0.8)" />
          <ThemedText style={styles.cardsText}>
            {cards.length} {cards.length === 1 ? "Card" : "Cards"}
          </ThemedText>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <ThemedText style={styles.statLabel}>Available Credit</ThemedText>
          <ThemedText style={styles.statValue}>{formatAmount(totalAvailable)}</ThemedText>
        </View>
        <View style={styles.stat}>
          <ThemedText style={styles.statLabel}>Credit Limit</ThemedText>
          <ThemedText style={styles.statValue}>{formatAmount(totalLimit)}</ThemedText>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <ThemedText style={styles.progressLabel}>Credit Utilization</ThemedText>
          <ThemedText style={styles.progressPercent}>
            {utilizationPercent.toFixed(1)}%
          </ThemedText>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${Math.min(utilizationPercent, 100)}%`,
                backgroundColor: utilizationPercent > 70 
                  ? "#FFCDD2" 
                  : utilizationPercent > 30 
                    ? "#FFE0B2" 
                    : "#C8E6C9"
              }
            ]} 
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  label: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginBottom: 4,
  },
  amount: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
  },
  cardsCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  cardsText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: Spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  progressSection: {
    gap: Spacing.sm,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
  progressPercent: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
});
