import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, StyleSheet, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { TransactionCard } from "@/components/TransactionCard";
import { FilterChips } from "@/components/FilterChips";
import { EmptyState } from "@/components/EmptyState";
import { FAB } from "@/components/FAB";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";
import { getTransactions, getCards } from "@/lib/storage";
import type { Transaction, CreditCard, TransactionCategory } from "@/types";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

export default function TransactionsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory | "all">("all");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [loadedTransactions, loadedCards] = await Promise.all([
        getTransactions(),
        getCards(),
      ]);
      setTransactions(loadedTransactions);
      setCards(loadedCards);
    } catch (error) {
      console.error("Error loading transactions:", error);
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

  const getCardById = (cardId: string) => {
    return cards.find((c) => c.id === cardId);
  };

  const filteredTransactions = selectedCategory === "all"
    ? transactions
    : transactions.filter((t) => t.category === selectedCategory);

  const renderItem = ({ item }: { item: Transaction }) => (
    <TransactionCard
      transaction={item}
      card={getCardById(item.cardId)}
    />
  );

  const renderEmpty = () => (
    <EmptyState
      image={require("../../assets/images/empty-transactions.png")}
      title="No Transactions"
      description={
        selectedCategory === "all"
          ? "Your transactions will appear here once detected from SMS messages."
          : `No ${selectedCategory} transactions found.`
      }
      actionLabel="Add Transaction"
      onAction={() => navigation.navigate("AddTransaction")}
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
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <FilterChips
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        }
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={{
          paddingTop: headerHeight,
          paddingBottom: tabBarHeight + Spacing.xl + 70,
          paddingHorizontal: Spacing.lg,
          flexGrow: 1,
        }}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        stickyHeaderIndices={[0]}
      />
      <FAB 
        onPress={() => navigation.navigate("AddTransaction")} 
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
});
