import React, { useState } from "react";
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
import { addCard, generateId } from "@/lib/storage";
import type { CreditCard } from "@/types";

const cardBrands: Array<{ value: CreditCard["brand"]; label: string; color: string }> = [
  { value: "visa", label: "Visa", color: "#1A1F71" },
  { value: "mastercard", label: "Mastercard", color: "#EB001B" },
  { value: "amex", label: "American Express", color: "#006FCF" },
  { value: "other", label: "Other", color: "#616161" },
];

export default function AddCardScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [lastFourDigits, setLastFourDigits] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<CreditCard["brand"]>("visa");
  const [limit, setLimit] = useState("");
  const [balance, setBalance] = useState("");
  const [settlementDate, setSettlementDate] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a card name");
      return;
    }
    if (!lastFourDigits || lastFourDigits.length !== 4) {
      Alert.alert("Error", "Please enter the last 4 digits of your card");
      return;
    }
    if (!limit || parseFloat(limit) <= 0) {
      Alert.alert("Error", "Please enter a valid credit limit");
      return;
    }
    const settlement = parseInt(settlementDate);
    if (!settlement || settlement < 1 || settlement > 31) {
      Alert.alert("Error", "Please enter a valid settlement date (1-31)");
      return;
    }

    setSaving(true);
    try {
      const brand = cardBrands.find((b) => b.value === selectedBrand);
      
      await addCard({
        id: generateId(),
        name: name.trim(),
        lastFourDigits,
        brand: selectedBrand,
        limit: parseFloat(limit),
        balance: parseFloat(balance) || 0,
        settlementDate: settlement,
        color: brand?.color || "#616161",
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to save card");
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
          Card Name
        </ThemedText>
        <TextInput
          style={[styles.input, { backgroundColor: theme.backgroundDefault, color: theme.text }]}
          value={name}
          onChangeText={setName}
          placeholder="e.g., Premium Rewards"
          placeholderTextColor={theme.textHint}
          testID="input-card-name"
        />
      </View>

      <View style={styles.inputGroup}>
        <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
          Last 4 Digits
        </ThemedText>
        <TextInput
          style={[styles.input, { backgroundColor: theme.backgroundDefault, color: theme.text }]}
          value={lastFourDigits}
          onChangeText={(text) => setLastFourDigits(text.replace(/\D/g, "").slice(0, 4))}
          placeholder="1234"
          placeholderTextColor={theme.textHint}
          keyboardType="number-pad"
          maxLength={4}
          testID="input-last-four"
        />
      </View>

      <View style={styles.inputGroup}>
        <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
          Card Brand
        </ThemedText>
        <View style={styles.brandsContainer}>
          {cardBrands.map((brand) => {
            const isSelected = selectedBrand === brand.value;
            return (
              <Pressable
                key={brand.value}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedBrand(brand.value);
                }}
                style={[
                  styles.brandChip,
                  {
                    backgroundColor: isSelected ? brand.color : theme.backgroundDefault,
                    borderColor: isSelected ? brand.color : theme.backgroundSecondary,
                  },
                ]}
                testID={`brand-${brand.value}`}
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
                  {brand.label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
            Credit Limit
          </ThemedText>
          <View style={[styles.currencyInput, { backgroundColor: theme.backgroundDefault }]}>
            <ThemedText style={styles.currency}>$</ThemedText>
            <TextInput
              style={[styles.currencyTextInput, { color: theme.text }]}
              value={limit}
              onChangeText={setLimit}
              placeholder="10000"
              placeholderTextColor={theme.textHint}
              keyboardType="decimal-pad"
              testID="input-limit"
            />
          </View>
        </View>

        <View style={[styles.inputGroup, styles.halfWidth]}>
          <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
            Current Balance
          </ThemedText>
          <View style={[styles.currencyInput, { backgroundColor: theme.backgroundDefault }]}>
            <ThemedText style={styles.currency}>$</ThemedText>
            <TextInput
              style={[styles.currencyTextInput, { color: theme.text }]}
              value={balance}
              onChangeText={setBalance}
              placeholder="0"
              placeholderTextColor={theme.textHint}
              keyboardType="decimal-pad"
              testID="input-balance"
            />
          </View>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
          Settlement Date (Day of Month)
        </ThemedText>
        <TextInput
          style={[styles.input, { backgroundColor: theme.backgroundDefault, color: theme.text }]}
          value={settlementDate}
          onChangeText={(text) => setSettlementDate(text.replace(/\D/g, "").slice(0, 2))}
          placeholder="25"
          placeholderTextColor={theme.textHint}
          keyboardType="number-pad"
          maxLength={2}
          testID="input-settlement"
        />
      </View>

      <Button 
        onPress={handleSave} 
        disabled={saving}
        style={styles.saveButton}
      >
        {saving ? "Saving..." : "Add Card"}
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
  row: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  currencyInput: {
    flexDirection: "row",
    alignItems: "center",
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
  },
  currency: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: Spacing.xs,
  },
  currencyTextInput: {
    flex: 1,
    fontSize: 16,
  },
  brandsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  brandChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  saveButton: {
    marginTop: Spacing.lg,
  },
});
