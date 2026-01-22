import React, { useState, useEffect, useCallback } from "react";
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  RefreshControl,
  FlatList,
  Dimensions 
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ThemedText } from "@/components/ThemedText";
import { BalanceSummary } from "@/components/BalanceSummary";
import { SettlementTimeline } from "@/components/SettlementTimeline";
import { PromotionCard } from "@/components/PromotionCard";
import { TransactionCard } from "@/components/TransactionCard";
import { SectionHeader } from "@/components/SectionHeader";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";
import { getCards, getTransactions, getPromotions, saveCards, saveTransactions, savePromotions } from "@/lib/storage";
import { sampleCards, sampleTransactions, samplePromotions } from "@/lib/sampleData";
import type { CreditCard, Transaction, Promotion } from "@/types";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [cards, setCards] = useState<CreditCard[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      let [loadedCards, loadedTransactions, loadedPromotions] = await Promise.all([
        getCards(),
        getTransactions(),
        getPromotions(),
      ]);

      if (loadedCards.length === 0) {
        await saveCards(sampleCards);
        loadedCards = sampleCards;
      }
      if (loadedTransactions.length === 0) {
        await saveTransactions(sampleTransactions);
        loadedTransactions = sampleTransactions;
      }
      if (loadedPromotions.length === 0) {
        await savePromotions(samplePromotions);
        loadedPromotions = samplePromotions;
      }

      setCards(loadedCards);
      setTransactions(loadedTransactions);
      setPromotions(loadedPromotions);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const getCardById = (cardId: string) => {
    return cards.find((c) => c.id === cardId);
  };

  const recentTransactions = transactions.slice(0, 5);
  const activePromotions = promotions.filter((p) => {
    const endDate = new Date(p.endDate);
    return endDate > new Date();
  });

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundRoot }]}>
        <ThemedText>Loading...</ThemedText>
      </View>
    );
  }

  if (cards.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <EmptyState
          image={require("../../assets/images/empty-cards.png")}
          title="Welcome to CashTrack"
          description="Add your first credit card to start tracking your cash flow and get personalized promotions."
          actionLabel="Add Card"
          onAction={() => navigation.navigate("AddCard")}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: tabBarHeight + Spacing.xl,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.content}>
        <BalanceSummary cards={cards} />

        <SettlementTimeline cards={cards} />

        {activePromotions.length > 0 ? (
          <View style={styles.section}>
            <SectionHeader 
              title="Active Promotions" 
              actionLabel="See All"
              onAction={() => navigation.navigate("Main", { screen: "PromotionsTab" })}
            />
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={activePromotions.slice(0, 5)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <PromotionCard 
                  promotion={item} 
                  compact 
                  onPress={() => navigation.navigate("PromotionDetail", { promotionId: item.id })}
                />
              )}
              contentContainerStyle={styles.promotionsList}
            />
          </View>
        ) : null}

        <View style={styles.section}>
          <SectionHeader 
            title="Recent Transactions" 
            actionLabel="See All"
            onAction={() => navigation.navigate("Main", { screen: "TransactionsTab" })}
          />
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                card={getCardById(transaction.cardId)}
              />
            ))
          ) : (
            <View style={[styles.emptySection, { backgroundColor: theme.backgroundDefault }]}>
              <ThemedText style={{ color: theme.textSecondary }}>
                No transactions yet
              </ThemedText>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  promotionsList: {
    paddingRight: Spacing.lg,
  },
  emptySection: {
    padding: Spacing.xl,
    borderRadius: 12,
    alignItems: "center",
  },
});
