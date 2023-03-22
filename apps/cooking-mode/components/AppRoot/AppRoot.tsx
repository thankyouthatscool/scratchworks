import { createDrawerNavigator } from "@react-navigation/drawer";
import { useEffect, useRef } from "react";

import { useAppDispatch, useAppSelector } from "@hooks";
import { RecipeScreen } from "@screens/RecipeScreen";
import { HomeScreen } from "@screens/HomeScreen";
import { RecipePlayerScreen } from "@screens/RecipePlayerScreen";
import { SettingsScreen } from "@screens/SettingsScreen";
import { bulkSetRecipes, setAppSettings, setIsAppVisible } from "@store";
import type { RootDrawerNavigatorProps } from "@types";
import { getAllLocalStorageRecipes, getLocalStorageSettings } from "@utils";
import { AppState } from "react-native";

const RootDrawer = createDrawerNavigator<RootDrawerNavigatorProps>();

export const AppRoot = () => {
  const dispatch = useAppDispatch();

  const appState = useRef(AppState.currentState);

  const { selectedRecipe } = useAppSelector(({ recipes }) => recipes);

  const handleInitialLoad = async () => {
    const appSettings = await getLocalStorageSettings();
    const { recipes } = await getAllLocalStorageRecipes();

    dispatch(bulkSetRecipes(recipes));

    if (!!appSettings) {
      dispatch(setAppSettings(appSettings));
    }
  };

  useEffect(() => {
    handleInitialLoad();
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        dispatch(setIsAppVisible(true));
      } else if (
        appState.current === "active" &&
        (nextAppState === "inactive" || nextAppState === "background")
      ) {
        dispatch(setIsAppVisible(false));
      }

      appState.current = nextAppState;
    });

    return () => {
      sub.remove();
    };
  }, []);

  return (
    <RootDrawer.Navigator screenOptions={{ headerShown: false }}>
      <RootDrawer.Screen component={HomeScreen} name="Home" />
      <RootDrawer.Screen
        component={RecipeScreen}
        name="Recipe"
        options={{
          drawerItemStyle: { display: !!selectedRecipe ? "flex" : "none" },
        }}
      />
      <RootDrawer.Screen component={RecipePlayerScreen} name="RecipePlayer" />
      <RootDrawer.Screen component={SettingsScreen} name="Settings" />
    </RootDrawer.Navigator>
  );
};
