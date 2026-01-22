export type TransactionCategory = 
  | "supermarket"
  | "travel"
  | "dining"
  | "shopping"
  | "bills"
  | "other";

export interface Transaction {
  id: string;
  amount: number;
  merchant: string;
  category: TransactionCategory;
  cardId: string;
  date: string;
  description?: string;
  isCredit?: boolean;
}

export interface CreditCard {
  id: string;
  name: string;
  lastFourDigits: string;
  brand: "visa" | "mastercard" | "amex" | "other";
  balance: number;
  limit: number;
  settlementDate: number;
  color: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  category: TransactionCategory;
  cardId: string;
  discount: string;
  startDate: string;
  endDate: string;
  terms?: string;
  synced?: boolean;
  calendarEventId?: string;
}

export interface SMSMessage {
  id: string;
  sender: string;
  body: string;
  date: string;
  parsed?: boolean;
}
