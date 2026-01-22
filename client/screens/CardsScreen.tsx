import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, StyleSheet, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { CreditCardItem } from "@/components/CreditCardItem";
import { PromotionCard } from "@/components/PromotionCard";
import { SectionHeader } from "@/components/SectionHeader";
import { EmptyState } from "@/components/EmptyState";
import { FAB } from "@/components/FAB";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";
import { getCards, getPromotions } from "@/lib/storage";
import type { CreditCard, Promotion } from "@/types";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

export default function CardsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [cards, setCards] = useState<CreditCard[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [loadedCards, loadedPromotions] = await Promise.all([
        getCards(),
        getPromotions(),
      ]);
      setCards(loadedCards);
      setPromotions(loadedPromotions);
    } catch (error) {
      console.error("Error loading cards:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation, loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const getPromotionsForCard = (cardId: string) => {
    return promotions.filter((p) => p.cardId === cardId && new Date(p.endDate) > new Date());
  };

  const renderCard = ({ item }: { item: CreditCard }) => {
    const cardPromotions = getPromotionsForCard(item.id);
    
    return (
      <View style={styles.cardSection}>
        <CreditCardItem 
          card={item} 
          onPress={() => navigation.navigate("CardDetail", { cardId: item.id })}
        />
        
        {cardPromotions.length > 0 ? (
          <View style={styles.promotionsSection}>
            <SectionHeader title="Linked Promotions" />
            {cardPromotions.slice(0, 2).map((promo) => (
              <PromotionCard
                key={promo.id}
                promotion={promo}
                onPress={() => navigation.navigate("PromotionDetail", { promotionId: promo.id })}
              />
            ))}
          </View>
        ) : null}
      </View>
    );
  };

  const renderEmpty = () => (
    <EmptyState
      image={require("../../assets/images/empty-cards.png")}
      title="No Cards Yet"
      description="Add your credit cards to track balances, settlement dates, and unlock exclusive promotions."
      actionLabel="Add Card"
      onAction={() => navigation.navigate("AddCard")}
    />
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundRoot }]} />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={{
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: tabBarHeight + Spacing.xl + 70,
          paddingHorizontal: Spacing.lg,
          flexGrow: 1,
        }}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <FAB 
        onPress={() => navigation.navigate("AddCard")} 
        icon="plus"
        bottom={tabBarHeight + Spacing.lg}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
  },
  cardSection: {
    marginBottom: Spacing.xl,
  },
  promotionsSection: {
    marginTop: -Spacing.sm,
  },
});
