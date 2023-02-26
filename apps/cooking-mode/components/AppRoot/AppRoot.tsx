import { createDrawerNavigator } from "@react-navigation/drawer";

import { HomeScreen } from "@screens/HomeScreen";
import { SettingsScreen } from "@screens/SettingsScreen";
import type { RootDrawerNavigatorProps } from "@types";

const RootDrawer = createDrawerNavigator<RootDrawerNavigatorProps>();

export const AppRoot = () => {
  return (
    <RootDrawer.Navigator screenOptions={{ headerShown: false }}>
      <RootDrawer.Screen component={HomeScreen} name="Home" />
      <RootDrawer.Screen component={SettingsScreen} name="Settings" />
    </RootDrawer.Navigator>
  );
};
