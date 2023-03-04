import { createDrawerNavigator } from "@react-navigation/drawer";
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@hooks";
import { RecipeScreen } from "@screens/RecipeScreen";
import { HomeScreen } from "@screens/HomeScreen";
import { SettingsScreen } from "@screens/SettingsScreen";
import { bulkSetRecipes, setAppSettings } from "@store";
import type { RootDrawerNavigatorProps } from "@types";
import { getAllLocalStorageRecipes, getLocalStorageSettings } from "@utils";

const RootDrawer = createDrawerNavigator<RootDrawerNavigatorProps>();

export const AppRoot = () => {
  const dispatch = useAppDispatch();

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
      <RootDrawer.Screen component={SettingsScreen} name="Settings" />
    </RootDrawer.Navigator>
  );
};
