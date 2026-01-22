import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CardsScreen from "@/screens/CardsScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type CardsStackParamList = {
  Cards: undefined;
};

const Stack = createNativeStackNavigator<CardsStackParamList>();

export default function CardsStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Cards"
        component={CardsScreen}
        options={{
          title: "My Cards",
        }}
      />
    </Stack.Navigator>
  );
}
