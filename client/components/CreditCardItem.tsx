import React from "react";
import { View, StyleSheet, Pressable, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import type { CreditCard } from "@/types";

interface CreditCardItemProps {
  card: CreditCard;
  onPress?: () => void;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - Spacing.lg * 2;
const CARD_HEIGHT = CARD_WIDTH * 0.63;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const brandLogos: Record<string, keyof typeof Feather.glyphMap> = {
  visa: "credit-card",
  mastercard: "credit-card",
  amex: "credit-card",
  other: "credit-card",
};

export function CreditCardItem({ card, onPress }: CreditCardItemProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress?.();
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getGradientColors = (): readonly [string, string, ...string[]] => {
    switch (card.brand) {
      case "visa":
        return ["#1A1F71", "#2D3A8C"];
      case "mastercard":
        return ["#EB001B", "#F79E1B"];
      case "amex":
        return ["#006FCF", "#00A3E0"];
      default:
        return ["#424242", "#616161"];
    }
  };

  const availableCredit = card.limit - card.balance;
  const utilizationPercent = (card.balance / card.limit) * 100;

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, Shadows.card, animatedStyle]}
      testID={`credit-card-${card.id}`}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <ThemedText style={styles.cardName}>{card.name}</ThemedText>
          <Feather 
            name={brandLogos[card.brand]} 
            size={28} 
            color="rgba(255,255,255,0.9)" 
          />
        </View>

        <View style={styles.cardNumber}>
          <ThemedText style={styles.dots}>**** **** ****</ThemedText>
          <ThemedText style={styles.lastFour}>{card.lastFourDigits}</ThemedText>
        </View>

        <View style={styles.footer}>
          <View style={styles.balanceSection}>
            <ThemedText style={styles.balanceLabel}>Current Balance</ThemedText>
            <ThemedText style={styles.balanceAmount}>
              {formatAmount(card.balance)}
            </ThemedText>
          </View>

          <View style={styles.limitSection}>
            <ThemedText style={styles.limitLabel}>Available</ThemedText>
            <ThemedText style={styles.limitAmount}>
              {formatAmount(availableCredit)}
            </ThemedText>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${Math.min(utilizationPercent, 100)}%` }
              ]} 
            />
          </View>
          <ThemedText style={styles.settlementText}>
            Settlement: Day {card.settlementDate}
          </ThemedText>
        </View>
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    marginBottom: Spacing.lg,
  },
  gradient: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  cardNumber: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  dots: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 20,
    letterSpacing: 2,
  },
  lastFour: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  balanceSection: {
    flex: 1,
  },
  balanceLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginBottom: 2,
  },
  balanceAmount: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  limitSection: {
    alignItems: "flex-end",
  },
  limitLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginBottom: 2,
  },
  limitAmount: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  progressContainer: {
    gap: Spacing.xs,
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
  },
  settlementText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    textAlign: "right",
  },
});
