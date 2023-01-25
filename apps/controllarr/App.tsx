import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";

import { AppRoot } from "@components/AppRoot";
import { store } from "@store";
import { trpc } from "@utils";

const API_URL: string = Constants.expoConfig?.extra?.API_URL;
const CF_ACCESS_CLIENT_ID: string =
  Constants.expoConfig?.extra?.["CF-Access-Client-Id"];
const CF_ACCESS_CLIENT_SECRET: string =
  Constants.expoConfig?.extra?.["CF-Access-Client-Secret"];

export const App = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${API_URL}/trpc`,
          headers() {
            return {
              "CF-Access-Client-Id": CF_ACCESS_CLIENT_ID,
              "CF-Access-Client-Secret": CF_ACCESS_CLIENT_SECRET,
            };
          },
        }),
      ],
    })
  );

  return (
    <ReduxProvider store={store}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
              <RootSiblingParent>
                <StatusBar style="auto" />
                <AppRoot />
              </RootSiblingParent>
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </trpc.Provider>
    </ReduxProvider>
  );
};

// TODO: Upload chart.
// TODO: Proper color codes and variables.
// TODO: Long tap and double tap for pause and delete.
// TODO: Haptics for various actions.
// TODO: Store the refresh rate time in some sort of a variable.
// TODO: Only show the upload chart if change
// TODO: Auto pause stored on the backend.
// TODO: Pass context/middleware that show whether auto pause is enabled.
