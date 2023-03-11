import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";

import { AppRoot } from "@components/AppRoot";
import { store } from "@store";
import { bulkSetLocalStorageRecipes } from "@utils";

const pop = async () => {
  await bulkSetLocalStorageRecipes([
    {
      id: "d95405d8-1e9c-456e-aaa5-cabd5fd83e9a",
      name: "Yes yes yes",
      reactions: ["🔥"],
      steps: [],
      tags: [
        "yes yes yes",
        "zero dark thirty",
        "tig ol bitties",
        "big ol poopies",
        "ziggy zoooooogogogo",
      ],
    },
    {
      id: "051c555c-83ab-42b7-88d6-b502b33f2fa1",
      name: "No No No",
      reactions: ["🐩"],
      steps: [],
      tags: ["no no no"],
    },
  ]);
};

// pop();

export const App = () => {
  return (
    <ReduxProvider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <SafeAreaProvider>
            <AppRoot />
          </SafeAreaProvider>
        </NavigationContainer>
      </GestureHandlerRootView>
    </ReduxProvider>
  );
};
