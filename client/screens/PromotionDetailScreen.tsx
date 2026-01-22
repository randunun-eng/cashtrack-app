import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { CategoryBadge } from "@/components/CategoryBadge";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, CategoryColors } from "@/constants/theme";
import { getPromotions, updatePromotion, getCards } from "@/lib/storage";
import { apiRequest } from "@/lib/query-client";
import type { Promotion, CreditCard } from "@/types";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type PromotionDetailRouteProp = RouteProp<RootStackParamList, "PromotionDetail">;

export default function PromotionDetailScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme, isDark } = useTheme();
  const route = useRoute<PromotionDetailRouteProp>();
  const navigation = useNavigation();

  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [card, setCard] = useState<CreditCard | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [promotions, cards] = await Promise.all([
        getPromotions(),
        getCards(),
      ]);
      
      const found = promotions.find((p) => p.id === route.params.promotionId);
      if (found) {
        setPromotion(found);
        const linkedCard = cards.find((c) => c.id === found.cardId);
        setCard(linkedCard || null);
      }
    } catch (error) {
      console.error("Error loading promotion:", error);
    } finally {
      setLoading(false);
    }
  }, [route.params.promotionId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSyncToCalendar = async () => {
    if (!promotion) return;

    setSyncing(true);
    try {
      const response = await apiRequest("POST", "/api/calendar/events", {
        title: `${promotion.discount} - ${promotion.title}`,
        description: `${promotion.description}\n\nTerms: ${promotion.terms || "N/A"}`,
        startDate: promotion.startDate,
        endDate: promotion.endDate,
        category: promotion.category,
      });

      const data = await response.json();

      const updatedPromotion = {
        ...promotion,
        synced: true,
        calendarEventId: data.eventId,
      };

      await updatePromotion(updatedPromotion);
      setPromotion(updatedPromotion);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "Promotion added to your Google Calendar!");
    } catch (error) {
      console.error("Error syncing to calendar:", error);
      Alert.alert("Error", "Failed to sync to Google Calendar. Please try again.");
    } finally {
      setSyncing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysRemaining = () => {
    if (!promotion) return 0;
    const end = new Date(promotion.endDate);
    const now = new Date();
    const diffMs = end.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundRoot }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!promotion) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundRoot }]}>
        <ThemedText>Promotion not found</ThemedText>
      </View>
    );
  }

  const daysRemaining = getDaysRemaining();
  const isExpired = daysRemaining <= 0;
  const colorKey = isDark ? "dark" : "light";
  const categoryColor = CategoryColors[promotion.category]?.[colorKey] || CategoryColors.other[colorKey];

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <KeyboardAwareScrollViewCompat
        style={styles.scrollView}
        contentContainerStyle={{
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: insets.bottom + Spacing.xl + 80,
          paddingHorizontal: Spacing.lg,
        }}
      >
        <View style={[styles.header, { borderBottomColor: theme.backgroundSecondary }]}>
          <View style={[styles.discountBadge, { backgroundColor: `${categoryColor}15` }]}>
            <ThemedText style={[styles.discountText, { color: categoryColor }]}>
              {promotion.discount}
            </ThemedText>
          </View>

          <ThemedText type="h2" style={styles.title}>
            {promotion.title}
          </ThemedText>

          <View style={styles.metaRow}>
            <CategoryBadge category={promotion.category} />
            
            {promotion.synced ? (
              <View style={[styles.syncedBadge, { backgroundColor: `${theme.success}20` }]}>
                <Feather name="check-circle" size={14} color={theme.success} />
                <ThemedText style={[styles.syncedText, { color: theme.success }]}>
                  Synced to Calendar
                </ThemedText>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            Description
          </ThemedText>
          <ThemedText type="body" style={{ color: theme.textSecondary }}>
            {promotion.description}
          </ThemedText>
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Feather name="calendar" size={18} color={theme.textSecondary} />
              <View>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  Valid From
                </ThemedText>
                <ThemedText type="body">
                  {formatDate(promotion.startDate)}
                </ThemedText>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Feather 
                name="clock" 
                size={18} 
                color={isExpired ? theme.error : theme.textSecondary} 
              />
              <View>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  Expires
                </ThemedText>
                <ThemedText 
                  type="body"
                  style={isExpired ? { color: theme.error } : undefined}
                >
                  {formatDate(promotion.endDate)}
                </ThemedText>
              </View>
            </View>
          </View>

          {!isExpired ? (
            <View 
              style={[
                styles.daysRemainingBadge, 
                { backgroundColor: daysRemaining <= 7 ? `${theme.warning}20` : `${theme.primary}15` }
              ]}
            >
              <ThemedText 
                style={[
                  styles.daysRemainingText, 
                  { color: daysRemaining <= 7 ? theme.warning : theme.primary }
                ]}
              >
                {daysRemaining} {daysRemaining === 1 ? "day" : "days"} remaining
              </ThemedText>
            </View>
          ) : null}
        </View>

        {card ? (
          <View style={styles.section}>
            <ThemedText type="h4" style={styles.sectionTitle}>
              Linked Card
            </ThemedText>
            <View style={[styles.cardInfo, { backgroundColor: theme.backgroundDefault }]}>
              <Feather name="credit-card" size={20} color={theme.primary} />
              <View>
                <ThemedText type="body">{card.name}</ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  **** {card.lastFourDigits}
                </ThemedText>
              </View>
            </View>
          </View>
        ) : null}

        {promotion.terms ? (
          <View style={styles.section}>
            <ThemedText type="h4" style={styles.sectionTitle}>
              Terms & Conditions
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {promotion.terms}
            </ThemedText>
          </View>
        ) : null}
      </KeyboardAwareScrollViewCompat>

      {!promotion.synced && !isExpired ? (
        <View 
          style={[
            styles.bottomBar, 
            { 
              backgroundColor: theme.backgroundRoot,
              paddingBottom: insets.bottom + Spacing.lg,
            }
          ]}
        >
          <Button onPress={handleSyncToCalendar} disabled={syncing}>
            {syncing ? (
              "Syncing..."
            ) : (
              <>
                <Feather name="calendar" size={18} color="#FFFFFF" />
                {"  Add to Google Calendar"}
              </>
            )}
          </Button>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    paddingBottom: Spacing.xl,
    marginBottom: Spacing.xl,
    borderBottomWidth: 1,
  },
  discountBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xs,
    marginBottom: Spacing.md,
  },
  discountText: {
    fontSize: 20,
    fontWeight: "700",
  },
  title: {
    marginBottom: Spacing.md,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  syncedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  syncedText: {
    fontSize: 12,
    fontWeight: "500",
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  infoCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  daysRemainingBadge: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.xs,
    alignSelf: "center",
  },
  daysRemainingText: {
    fontSize: 14,
    fontWeight: "600",
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
});
