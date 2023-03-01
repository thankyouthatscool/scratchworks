import { createDrawerNavigator } from "@react-navigation/drawer";
import { Button, Text, View, Platform } from "react-native";
import { FC, useEffect, useState, useRef } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "@hooks";
import { HomeScreen } from "@screens/HomeScreen";
import { SettingsScreen } from "@screens/SettingsScreen";
import { setAppSettings } from "@store";
import type {
  RootDrawerNavigatorProps,
  RecipeScreenNavigationProps,
  Recipe,
} from "@types";
import { getLocalStorageSettings } from "@utils";

const RootDrawer = createDrawerNavigator<RootDrawerNavigatorProps>();

export const AppRoot = () => {
  const dispatch = useAppDispatch();

  const { selectedRecipe } = useAppSelector(({ recipes }) => recipes);

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

const RecipeScreen: FC<RecipeScreenNavigationProps> = ({ navigation }) => {
  const { recipes, selectedRecipe } = useAppSelector(({ recipes }) => recipes);

  const [targetRecipe, setTargetRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (!!selectedRecipe) {
      setTargetRecipe(
        () => recipes.find((recipe) => recipe.id === selectedRecipe)!
      );
    } else {
      navigation.navigate("Home");
    }
  }, [selectedRecipe]);

  return (
    <SafeAreaView>
      <Text>Selected Recipe: {selectedRecipe}</Text>
      <Text>{targetRecipe?.name}</Text>
      <Button
        onPress={() => {
          navigation.goBack();
        }}
        title="back"
      />
    </SafeAreaView>
  );
};
