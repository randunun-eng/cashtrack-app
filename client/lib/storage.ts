import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Transaction, CreditCard, Promotion } from "@/types";

const STORAGE_KEYS = {
  TRANSACTIONS: "@cashtrack:transactions",
  CARDS: "@cashtrack:cards",
  PROMOTIONS: "@cashtrack:promotions",
  SETTINGS: "@cashtrack:settings",
};

export interface AppSettings {
  calendarSyncEnabled: boolean;
  notificationsEnabled: boolean;
  theme: "system" | "light" | "dark";
}

const defaultSettings: AppSettings = {
  calendarSyncEnabled: false,
  notificationsEnabled: true,
  theme: "system",
};

export async function getTransactions(): Promise<Transaction[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function saveTransactions(transactions: Transaction[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
}

export async function addTransaction(transaction: Transaction): Promise<void> {
  const transactions = await getTransactions();
  transactions.unshift(transaction);
  await saveTransactions(transactions);
}

export async function deleteTransaction(id: string): Promise<void> {
  const transactions = await getTransactions();
  const filtered = transactions.filter((t) => t.id !== id);
  await saveTransactions(filtered);
}

export async function getCards(): Promise<CreditCard[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CARDS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function saveCards(cards: CreditCard[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
}

export async function addCard(card: CreditCard): Promise<void> {
  const cards = await getCards();
  cards.push(card);
  await saveCards(cards);
}

export async function updateCard(card: CreditCard): Promise<void> {
  const cards = await getCards();
  const index = cards.findIndex((c) => c.id === card.id);
  if (index !== -1) {
    cards[index] = card;
    await saveCards(cards);
  }
}

export async function deleteCard(id: string): Promise<void> {
  const cards = await getCards();
  const filtered = cards.filter((c) => c.id !== id);
  await saveCards(filtered);
}

export async function getPromotions(): Promise<Promotion[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PROMOTIONS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function savePromotions(promotions: Promotion[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.PROMOTIONS, JSON.stringify(promotions));
}

export async function addPromotion(promotion: Promotion): Promise<void> {
  const promotions = await getPromotions();
  promotions.push(promotion);
  await savePromotions(promotions);
}

export async function updatePromotion(promotion: Promotion): Promise<void> {
  const promotions = await getPromotions();
  const index = promotions.findIndex((p) => p.id === promotion.id);
  if (index !== -1) {
    promotions[index] = promotion;
    await savePromotions(promotions);
  }
}

export async function deletePromotion(id: string): Promise<void> {
  const promotions = await getPromotions();
  const filtered = promotions.filter((p) => p.id !== id);
  await savePromotions(filtered);
}

export async function getSettings(): Promise<AppSettings> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
