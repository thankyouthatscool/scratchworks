import { createDrawerNavigator } from "@react-navigation/drawer";
import { useEffect } from "react";

import { useAppDispatch } from "@hooks";
import { HomeScreen } from "@screens/HomeScreen";
import { SettingsScreen } from "@screens/SettingsScreen";
import { setAppSettings } from "@store";
import type { RootDrawerNavigatorProps } from "@types";
import { getLocalStorageSettings } from "@utils";

const RootDrawer = createDrawerNavigator<RootDrawerNavigatorProps>();

export const AppRoot = () => {
  const dispatch = useAppDispatch();

  const handleInitialLoad = async () => {
    const appSettings = await getLocalStorageSettings();

    if (!!appSettings) {
      dispatch(setAppSettings(appSettings));
    }
  };

  useEffect(() => {
    handleInitialLoad();
  });

  return (
    <RootDrawer.Navigator screenOptions={{ headerShown: false }}>
      <RootDrawer.Screen component={HomeScreen} name="Home" />
      <RootDrawer.Screen component={SettingsScreen} name="Settings" />
    </RootDrawer.Navigator>
  );
};
