import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Button, ScrollView, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";

import { AppFooter } from "@components/AppFooter";
import { AppHeader } from "@components/AppHeader";
import { useAppSelector } from "@hooks";
import { store } from "@store";

export const App = () => {
  return (
    <ReduxProvider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <RootSiblingParent>
            <StatusBar style="auto" backgroundColor="white" />
            <AppRoot />
          </RootSiblingParent>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ReduxProvider>
  );
};

export const AppRoot = () => {
  const { headerHeight } = useAppSelector(({ app }) => app);

  const [movementDir, setMovementDir] = useState(false);

  return (
    <SafeAreaView style={{ backgroundColor: "#F8FAFC" }}>
      <AppHeader movementDir={movementDir} />
      <AppFooter movementDir={movementDir} />
      <ScrollView
        style={{ height: "100%" }}
        onMomentumScrollBegin={(e) => {
          if (e?.nativeEvent?.velocity?.y! < 0) {
            setMovementDir(() => true);
          } else {
            setMovementDir(() => false);
          }
        }}
      >
        <View style={{ height: headerHeight }} />
        {Array.from({ length: 23 }).map((_, index) => (
          <Text key={index}>Hello</Text>
        ))}
      </ScrollView>
      <Button
        onPress={() => {
          setMovementDir((d) => !d);
        }}
        title="test"
      />
    </SafeAreaView>
  );
};

// TODO: GENERIC_ERROR_MESSAGE for toast - make it more usable.
