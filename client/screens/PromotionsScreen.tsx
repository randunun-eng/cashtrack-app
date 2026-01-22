import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, StyleSheet, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { PromotionCard } from "@/components/PromotionCard";
import { FilterChips } from "@/components/FilterChips";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";
import { getPromotions } from "@/lib/storage";
import type { Promotion, TransactionCategory } from "@/types";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

export default function PromotionsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory | "all">("all");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const loadedPromotions = await getPromotions();
      const activePromotions = loadedPromotions.filter(
        (p) => new Date(p.endDate) > new Date()
      );
      setPromotions(activePromotions);
    } catch (error) {
      console.error("Error loading promotions:", error);
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

  const filteredPromotions = selectedCategory === "all"
    ? promotions
    : promotions.filter((p) => p.category === selectedCategory);

  const renderItem = ({ item }: { item: Promotion }) => (
    <PromotionCard
      promotion={item}
      onPress={() => navigation.navigate("PromotionDetail", { promotionId: item.id })}
    />
  );

  const renderEmpty = () => (
    <EmptyState
      title="No Promotions"
      description={
        selectedCategory === "all"
          ? "No active promotions available. Check back later for new offers!"
          : `No ${selectedCategory} promotions available.`
      }
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
        data={filteredPromotions}
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
          paddingBottom: tabBarHeight + Spacing.xl,
          paddingHorizontal: Spacing.lg,
          flexGrow: 1,
        }}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        stickyHeaderIndices={[0]}
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
