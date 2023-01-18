import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";

import Constants from "expo-constants";

import { AppRoot } from "@components/AppRoot";
import { store } from "@store";
import { trpc } from "@utils/trpc";

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
          <SafeAreaProvider>
            <StatusBar style="auto" />
            <AppRoot />
          </SafeAreaProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </ReduxProvider>
  );
};
