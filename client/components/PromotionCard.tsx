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
import { Spacing, BorderRadius, Shadows, CategoryColors } from "@/constants/theme";
import type { Promotion } from "@/types";

interface PromotionCardProps {
  promotion: Promotion;
  onPress?: () => void;
  compact?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PromotionCard({ promotion, onPress, compact = false }: PromotionCardProps) {
  const { theme, isDark } = useTheme();
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const getDaysRemaining = () => {
    const end = new Date(promotion.endDate);
    const now = new Date();
    const diffMs = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();
  const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;
  const isExpired = daysRemaining <= 0;

  const colorKey = isDark ? "dark" : "light";
  const categoryColor = CategoryColors[promotion.category]?.[colorKey] || CategoryColors.other[colorKey];

  if (compact) {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.compactContainer,
          { 
            backgroundColor: theme.backgroundDefault,
            borderLeftColor: categoryColor,
          },
          Shadows.card,
          animatedStyle,
        ]}
        testID={`promotion-card-${promotion.id}`}
      >
        <View style={styles.compactContent}>
          <ThemedText type="small" style={styles.compactDiscount}>
            {promotion.discount}
          </ThemedText>
          <ThemedText 
            type="small" 
            numberOfLines={1} 
            style={{ color: theme.textSecondary }}
          >
            {promotion.title}
          </ThemedText>
        </View>
        {promotion.synced ? (
          <Feather name="check-circle" size={16} color={theme.success} />
        ) : null}
      </AnimatedPressable>
    );
  }

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
      testID={`promotion-card-${promotion.id}`}
    >
      <View style={[styles.accentBar, { backgroundColor: categoryColor }]} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.discountBadge}>
            <ThemedText style={[styles.discountText, { color: categoryColor }]}>
              {promotion.discount}
            </ThemedText>
          </View>
          
          {promotion.synced ? (
            <View style={[styles.syncedBadge, { backgroundColor: `${theme.success}20` }]}>
              <Feather name="calendar" size={12} color={theme.success} />
              <ThemedText style={[styles.syncedText, { color: theme.success }]}>
                Synced
              </ThemedText>
            </View>
          ) : null}
        </View>

        <ThemedText type="body" style={styles.title} numberOfLines={2}>
          {promotion.title}
        </ThemedText>

        <ThemedText 
          type="small" 
          style={{ color: theme.textSecondary }}
          numberOfLines={2}
        >
          {promotion.description}
        </ThemedText>

        <View style={styles.footer}>
          <CategoryBadge category={promotion.category} size="small" />
          
          <View style={styles.expiryContainer}>
            <Feather 
              name="clock" 
              size={12} 
              color={
                isExpired 
                  ? theme.error 
                  : isExpiringSoon 
                    ? theme.warning 
                    : theme.textSecondary
              } 
            />
            <ThemedText 
              style={[
                styles.expiryText, 
                { 
                  color: isExpired 
                    ? theme.error 
                    : isExpiringSoon 
                      ? theme.warning 
                      : theme.textSecondary 
                }
              ]}
            >
              {isExpired 
                ? "Expired" 
                : daysRemaining === 1 
                  ? "1 day left" 
                  : `${daysRemaining} days left`
              }
            </ThemedText>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    marginBottom: Spacing.sm,
    flexDirection: "row",
  },
  accentBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  discountBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  discountText: {
    fontSize: 14,
    fontWeight: "700",
  },
  syncedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  syncedText: {
    fontSize: 11,
    fontWeight: "500",
  },
  title: {
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.xs,
  },
  expiryContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  expiryText: {
    fontSize: 12,
  },
  compactContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderLeftWidth: 3,
    marginRight: Spacing.sm,
    width: 180,
  },
  compactContent: {
    flex: 1,
    gap: 2,
  },
  compactDiscount: {
    fontWeight: "600",
  },
});
