import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";

import { AppRoot } from "@components/AppRoot";
import { store } from "@store";
import { trpc } from "@utils";

const API_URL: string = Constants.expoConfig?.extra?.API_URL;

export const App = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${API_URL}/trpc`,
        }),
      ],
    })
  );

  return (
    <ReduxProvider store={store}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <RootSiblingParent>
              <View style={styles.container}>
                <StatusBar backgroundColor="#00000000" style="auto" />
                <AppRoot />
              </View>
            </RootSiblingParent>
          </SafeAreaProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </ReduxProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
});

// TODO: Manual wipe of local storage data and pull the data from the spreadi.
// TODO: Haptics.
// TODO: Delete confirmation.
// TODO: Show loading states
// TODO: Save to db when an item is deleted.

// DONE: Some bullshit with the array when clearing all items from a location.
