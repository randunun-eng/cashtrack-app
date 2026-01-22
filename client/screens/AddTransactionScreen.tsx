import React, { useState, useEffect } from "react";
import { 
  View, 
  StyleSheet, 
  TextInput, 
  Pressable, 
  Alert 
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { addTransaction, getCards, generateId } from "@/lib/storage";
import type { CreditCard, TransactionCategory } from "@/types";

const categories: Array<{ value: TransactionCategory; label: string; icon: keyof typeof Feather.glyphMap }> = [
  { value: "supermarket", label: "Supermarket", icon: "shopping-cart" },
  { value: "travel", label: "Travel", icon: "map-pin" },
  { value: "dining", label: "Dining", icon: "coffee" },
  { value: "shopping", label: "Shopping", icon: "shopping-bag" },
  { value: "bills", label: "Bills", icon: "file-text" },
  { value: "other", label: "Other", icon: "more-horizontal" },
];

export default function AddTransactionScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const navigation = useNavigation();

  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory>("other");
  const [selectedCardId, setSelectedCardId] = useState<string>("");
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadCards = async () => {
      const loadedCards = await getCards();
      setCards(loadedCards);
      if (loadedCards.length > 0) {
        setSelectedCardId(loadedCards[0].id);
      }
    };
    loadCards();
  }, []);

  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }
    if (!merchant.trim()) {
      Alert.alert("Error", "Please enter a merchant name");
      return;
    }
    if (!selectedCardId) {
      Alert.alert("Error", "Please select a card");
      return;
    }

    setSaving(true);
    try {
      await addTransaction({
        id: generateId(),
        amount: parseFloat(amount),
        merchant: merchant.trim(),
        category: selectedCategory,
        cardId: selectedCardId,
        date: new Date().toISOString(),
        description: description.trim() || undefined,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to save transaction");
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
    >
      <View style={styles.inputGroup}>
        <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
          Amount
        </ThemedText>
        <View style={[styles.amountContainer, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText style={styles.currencySymbol}>$</ThemedText>
          <TextInput
            style={[styles.amountInput, { color: theme.text }]}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={theme.textHint}
            testID="input-amount"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
          Merchant
        </ThemedText>
        <TextInput
          style={[styles.input, { backgroundColor: theme.backgroundDefault, color: theme.text }]}
          value={merchant}
          onChangeText={setMerchant}
          placeholder="Enter merchant name"
          placeholderTextColor={theme.textHint}
          testID="input-merchant"
        />
      </View>

      <View style={styles.inputGroup}>
        <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
          Category
        </ThemedText>
        <View style={styles.categoriesGrid}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <Pressable
                key={cat.value}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedCategory(cat.value);
                }}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.backgroundDefault,
                    borderColor: isSelected ? theme.primary : theme.backgroundSecondary,
                  },
                ]}
                testID={`category-${cat.value}`}
              >
                <Feather 
                  name={cat.icon} 
                  size={16} 
                  color={isSelected ? "#FFFFFF" : theme.textSecondary} 
                />
                <ThemedText
                  type="small"
                  style={{ color: isSelected ? "#FFFFFF" : theme.text }}
                >
                  {cat.label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
          Card
        </ThemedText>
        <View style={styles.cardsContainer}>
          {cards.map((card) => {
            const isSelected = selectedCardId === card.id;
            return (
              <Pressable
                key={card.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedCardId(card.id);
                }}
                style={[
                  styles.cardChip,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.backgroundDefault,
                    borderColor: isSelected ? theme.primary : theme.backgroundSecondary,
                  },
                ]}
                testID={`card-select-${card.id}`}
              >
                <Feather 
                  name="credit-card" 
                  size={16} 
                  color={isSelected ? "#FFFFFF" : theme.textSecondary} 
                />
                <ThemedText
                  type="small"
                  style={{ color: isSelected ? "#FFFFFF" : theme.text }}
                >
                  {card.name} (*{card.lastFourDigits})
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
        {cards.length === 0 ? (
          <ThemedText type="small" style={{ color: theme.textSecondary, marginTop: Spacing.sm }}>
            No cards available. Add a card first.
          </ThemedText>
        ) : null}
      </View>

      <View style={styles.inputGroup}>
        <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
          Description (optional)
        </ThemedText>
        <TextInput
          style={[
            styles.input, 
            styles.textArea,
            { backgroundColor: theme.backgroundDefault, color: theme.text }
          ]}
          value={description}
          onChangeText={setDescription}
          placeholder="Add a note..."
          placeholderTextColor={theme.textHint}
          multiline
          numberOfLines={3}
          testID="input-description"
        />
      </View>

      <Button 
        onPress={handleSave} 
        disabled={saving || cards.length === 0}
        style={styles.saveButton}
      >
        {saving ? "Saving..." : "Add Transaction"}
      </Button>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: Spacing.xl,
  },
  label: {
    marginBottom: Spacing.sm,
    fontWeight: "500",
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: Spacing.md,
    textAlignVertical: "top",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "600",
    marginRight: Spacing.sm,
  },
  amountInput: {
    flex: 1,
    height: 60,
    fontSize: 32,
    fontWeight: "700",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  cardsContainer: {
    gap: Spacing.sm,
  },
  cardChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  saveButton: {
    marginTop: Spacing.lg,
  },
});
