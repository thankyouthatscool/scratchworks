import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";

import { AppRoot } from "@components/AppRoot";
import { store } from "@store";

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
