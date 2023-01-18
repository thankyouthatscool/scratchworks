import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@components/AppHeader";

export const AppRoot = () => {
  return (
    <SafeAreaView>
      <AppHeader />
      <Text>AppRoot</Text>
    </SafeAreaView>
  );
};
