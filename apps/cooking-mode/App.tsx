import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider as PaperProvider } from "react-native-paper";
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
      steps: [
        {
          description: "make it rain on these os",
          id: "6eee464e-8bac-4039-9bef-433b6b8df6c4",
          duration: 10,
          type: "cook",
        },
      ],
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
      steps: [
        {
          description: "mazda",
          id: "e3c7fee0-14b7-48a5-a45b-bb0fa1789c9d",
          duration: 99,
          type: "prep",
        },
      ],
      tags: ["no no no"],
    },
  ]);
};

// pop();

export const App = () => {
  return (
    <ReduxProvider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <SafeAreaProvider>
              <AppRoot />
            </SafeAreaProvider>
          </NavigationContainer>
        </PaperProvider>
      </GestureHandlerRootView>
    </ReduxProvider>
  );
};
