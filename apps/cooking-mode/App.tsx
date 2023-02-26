import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppRoot } from "@components/AppRoot";

export const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <SafeAreaProvider>
          <AppRoot />
        </SafeAreaProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};
