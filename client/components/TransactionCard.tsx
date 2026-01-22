import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { CategoryBadge } from "@/components/CategoryBadge";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import type { Transaction, CreditCard } from "@/types";

interface TransactionCardProps {
  transaction: Transaction;
  card?: CreditCard;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TransactionCard({ transaction, card, onPress }: TransactionCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return date.toLocaleTimeString("en-US", { 
        hour: "numeric", 
        minute: "2-digit",
        hour12: true 
      });
    } else if (diffHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric" 
      });
    }
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.container,
        { backgroundColor: theme.backgroundDefault },
        Shadows.card,
        animatedStyle,
      ]}
      testID={`transaction-card-${transaction.id}`}
    >
      <View style={styles.leftContent}>
        <View style={styles.header}>
          <ThemedText type="body" style={styles.merchant}>
            {transaction.merchant}
          </ThemedText>
          <ThemedText 
            style={[styles.amount, { color: theme.text }]}
          >
            -{formatAmount(transaction.amount)}
          </ThemedText>
        </View>
        
        <View style={styles.details}>
          <CategoryBadge category={transaction.category} size="small" />
          
          {card ? (
            <View style={styles.cardInfo}>
              <Feather name="credit-card" size={12} color={theme.textSecondary} />
              <ThemedText style={[styles.cardText, { color: theme.textSecondary }]}>
                {card.lastFourDigits}
              </ThemedText>
            </View>
          ) : null}
          
          <ThemedText style={[styles.date, { color: theme.textSecondary }]}>
            {formatDate(transaction.date)}
          </ThemedText>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  leftContent: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  merchant: {
    fontWeight: "500",
    flex: 1,
    marginRight: Spacing.sm,
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
  },
  details: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardText: {
    fontSize: 12,
  },
  date: {
    fontSize: 12,
    marginLeft: "auto",
  },
});
