import AsyncStorage from "@react-native-async-storage/async-storage";

import type { AppSettings, Recipe } from "@types";

// Settings

export const getLocalStorageSettings = async () => {
  const resString = await AsyncStorage.getItem("appSettings");

  if (!!resString) {
    const appSettings = JSON.parse(resString) as Partial<AppSettings>;

    return appSettings;
  }

  return null;
};

export const setLocalStorageSettings = async (
  appSettings: Partial<AppSettings>
) => {
  try {
    const currentAppSettings = await getLocalStorageSettings();

    if (!!currentAppSettings) {
      await AsyncStorage.setItem(
        "appSettings",
        JSON.stringify({ ...currentAppSettings, ...appSettings })
      );
    } else {
      await AsyncStorage.setItem("appSettings", JSON.stringify(appSettings));
    }

    return true;
  } catch {
    return false;
  }
};

// Data
// Recipes
export const getAllLocalStorageRecipes = async () => {
  const resString = await AsyncStorage.getItem("recipes");

  if (!!resString) {
    const recipes = JSON.parse(resString) as Recipe[];

    return { recipes, status: true };
  } else {
    return { recipes: [], status: false };
  }
};

export const bulkSetLocalStorageRecipes = async (recipes: Recipe[]) => {
  try {
    await AsyncStorage.setItem("recipes", JSON.stringify(recipes));

    return { status: true };
  } catch {
    return { status: false };
  }
};

export const updateLocalStorageRecipe = async (updatedRecipe: Recipe) => {
  const resString = await AsyncStorage.getItem("recipes");

  const recipes = JSON.parse(resString!) as Recipe[];

  const targetRecipe = recipes.find(
    (recipe) => recipe.id === updatedRecipe.id
  )!;
  const targetRecipeIndex = recipes.indexOf(targetRecipe);

  const updatedRecipes = [
    ...recipes.slice(0, targetRecipeIndex),
    updatedRecipe,
    ...recipes.slice(targetRecipeIndex + 1),
  ];

  await AsyncStorage.setItem("recipes", JSON.stringify(updatedRecipes));
};
