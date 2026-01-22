import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import type { CreditCard } from "@/types";

interface SettlementTimelineProps {
  cards: CreditCard[];
}

interface SettlementItem {
  card: CreditCard;
  daysUntil: number;
  date: Date;
}

export function SettlementTimeline({ cards }: SettlementTimelineProps) {
  const { theme } = useTheme();

  const getUpcomingSettlements = (): SettlementItem[] => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    return cards
      .map((card) => {
        let settlementDate: Date;
        
        if (card.settlementDate > currentDay) {
          settlementDate = new Date(currentYear, currentMonth, card.settlementDate);
        } else {
          settlementDate = new Date(currentYear, currentMonth + 1, card.settlementDate);
        }

        const diffMs = settlementDate.getTime() - today.getTime();
        const daysUntil = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        return {
          card,
          daysUntil,
          date: settlementDate,
        };
      })
      .filter((item) => item.daysUntil <= 7 && item.daysUntil >= 0)
      .sort((a, b) => a.daysUntil - b.daysUntil);
  };

  const settlements = getUpcomingSettlements();

  if (settlements.length === 0) {
    return null;
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 1) return theme.error;
    if (days <= 3) return theme.warning;
    return theme.primary;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundDefault }]}>
      <View style={styles.header}>
        <Feather name="alert-circle" size={18} color={theme.warning} />
        <ThemedText type="h4" style={styles.title}>
          Upcoming Settlements
        </ThemedText>
      </View>

      {settlements.map((item, index) => (
        <View 
          key={item.card.id}
          style={[
            styles.item,
            index < settlements.length - 1 && styles.itemBorder,
            { borderBottomColor: theme.backgroundSecondary }
          ]}
        >
          <View style={styles.itemLeft}>
            <View 
              style={[
                styles.indicator,
                { backgroundColor: getUrgencyColor(item.daysUntil) }
              ]} 
            />
            <View>
              <ThemedText type="body" style={styles.cardName}>
                {item.card.name}
              </ThemedText>
              <ThemedText 
                type="small" 
                style={{ color: theme.textSecondary }}
              >
                **** {item.card.lastFourDigits}
              </ThemedText>
            </View>
          </View>

          <View style={styles.itemRight}>
            <ThemedText type="body" style={styles.amount}>
              {formatAmount(item.card.balance)}
            </ThemedText>
            <ThemedText 
              type="small"
              style={{ color: getUrgencyColor(item.daysUntil) }}
            >
              {item.daysUntil === 0 
                ? "Due today" 
                : item.daysUntil === 1 
                  ? "Due tomorrow" 
                  : `In ${item.daysUntil} days`
              }
            </ThemedText>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  title: {
    flex: 1,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  itemBorder: {
    borderBottomWidth: 1,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardName: {
    fontWeight: "500",
  },
  itemRight: {
    alignItems: "flex-end",
  },
  amount: {
    fontWeight: "600",
  },
});
