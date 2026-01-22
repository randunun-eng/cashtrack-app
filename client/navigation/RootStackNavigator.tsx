import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainTabNavigator from "@/navigation/MainTabNavigator";
import AddTransactionScreen from "@/screens/AddTransactionScreen";
import AddCardScreen from "@/screens/AddCardScreen";
import PromotionDetailScreen from "@/screens/PromotionDetailScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type RootStackParamList = {
  Main: { screen?: string } | undefined;
  AddTransaction: undefined;
  AddCard: undefined;
  CardDetail: { cardId: string };
  PromotionDetail: { promotionId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={{
          title: "Add Transaction",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="AddCard"
        component={AddCardScreen}
        options={{
          title: "Add Card",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="PromotionDetail"
        component={PromotionDetailScreen}
        options={{
          title: "Promotion",
        }}
      />
    </Stack.Navigator>
  );
}
